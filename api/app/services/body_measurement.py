import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import torch
import torch.nn.functional as F
from typing import Tuple, Dict, Optional
from pathlib import Path
import urllib.request
import os


# Constants
KNOWN_OBJECT_WIDTH_CM = 21.0  # A4 paper width in cm
FOCAL_LENGTH = 600  # Default focal length
DEFAULT_HEIGHT_CM = 152.0  # Default height if not provided

# MediaPipe model paths
MODELS_DIR = Path("models/mediapipe")
POSE_MODEL_PATH = MODELS_DIR / "pose_landmarker_heavy.task"
HAND_MODEL_PATH = MODELS_DIR / "hand_landmarker.task"
FACE_MODEL_PATH = MODELS_DIR / "face_landmarker.task"

# Model download URLs (official MediaPipe models)
MODEL_URLS = {
    "pose_landmarker_heavy.task": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_heavy/float16/latest/pose_landmarker_heavy.task",
    "hand_landmarker.task": "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
    "face_landmarker.task": "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task"
}

# Legacy API compatibility mapping
class PoseLandmark:
    NOSE = 0
    LEFT_EYE_INNER = 1
    LEFT_EYE = 2
    LEFT_EYE_OUTER = 3
    RIGHT_EYE_INNER = 4
    RIGHT_EYE = 5
    RIGHT_EYE_OUTER = 6
    LEFT_EAR = 7
    RIGHT_EAR = 8
    MOUTH_LEFT = 9
    MOUTH_RIGHT = 10
    LEFT_SHOULDER = 11
    RIGHT_SHOULDER = 12
    LEFT_ELBOW = 13
    RIGHT_ELBOW = 14
    LEFT_WRIST = 15
    RIGHT_WRIST = 16
    LEFT_PINKY = 17
    RIGHT_PINKY = 18
    LEFT_INDEX = 19
    RIGHT_INDEX = 20
    LEFT_THUMB = 21
    RIGHT_THUMB = 22
    LEFT_HIP = 23
    RIGHT_HIP = 24
    LEFT_KNEE = 25
    RIGHT_KNEE = 26
    LEFT_ANKLE = 27
    RIGHT_ANKLE = 28
    LEFT_HEEL = 29
    RIGHT_HEEL = 30
    LEFT_FOOT_INDEX = 31
    RIGHT_FOOT_INDEX = 32


def download_model(model_name: str, force_download: bool = False):
    """Download MediaPipe model file if not exists"""
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    model_path = MODELS_DIR / model_name
    
    if model_path.exists() and not force_download:
        return model_path
    
    if model_name not in MODEL_URLS:
        raise ValueError(f"Unknown model: {model_name}")
    
    print(f"Downloading {model_name}...")
    url = MODEL_URLS[model_name]
    
    try:
        urllib.request.urlretrieve(url, model_path)
        print(f"Successfully downloaded {model_name}")
        return model_path
    except Exception as e:
        raise RuntimeError(f"Failed to download {model_name}: {e}")


class BodyMeasurementService:
    def __init__(self):
        # Download models if needed
        download_model("pose_landmarker_heavy.task")
        
        # Create PoseLandmarker options
        pose_options = vision.PoseLandmarkerOptions(
            base_options=python.BaseOptions(model_asset_path=str(POSE_MODEL_PATH)),
            running_mode=vision.RunningMode.IMAGE,
            num_poses=1,
            min_pose_detection_confidence=0.5,
            min_pose_presence_confidence=0.5,
            min_tracking_confidence=0.5,
            output_segmentation_masks=False
        )
        
        # Create PoseLandmarker
        self.pose_landmarker = vision.PoseLandmarker.create_from_options(pose_options)
        
        # Load depth estimation model
        self.depth_model = self._load_depth_model()
    
    @staticmethod
    def _load_depth_model():
        """Load depth estimation model"""
        model = torch.hub.load("intel-isl/MiDaS", "MiDaS_small")
        model.eval()
        return model
    
    @staticmethod
    def calibrate_focal_length(image: np.ndarray, real_width_cm: float, detected_width_px: float) -> float:
        """Dynamically calibrates focal length using a known object"""
        return (detected_width_px * FOCAL_LENGTH) / real_width_cm if detected_width_px else FOCAL_LENGTH
    
    def detect_reference_object(self, image: np.ndarray) -> Tuple[float, float]:
        """Detect reference object for calibration"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(largest_contour)
            focal_length = self.calibrate_focal_length(image, KNOWN_OBJECT_WIDTH_CM, w)
            scale_factor = KNOWN_OBJECT_WIDTH_CM / w
            return scale_factor, focal_length
        
        return 0.05, FOCAL_LENGTH
    
    def estimate_depth(self, image: np.ndarray) -> np.ndarray:
        """Uses AI-based depth estimation to improve circumference calculations"""
        input_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB) / 255.0
        input_tensor = torch.tensor(input_image, dtype=torch.float32).permute(2, 0, 1).unsqueeze(0)
        
        # Resize input to match MiDaS model input size
        input_tensor = F.interpolate(input_tensor, size=(384, 384), mode="bilinear", align_corners=False)

        with torch.no_grad():
            depth_map = self.depth_model(input_tensor)
        
        return depth_map.squeeze().numpy()
    
    @staticmethod
    def calculate_distance_using_height(
        landmarks, 
        image_height: int, 
        user_height_cm: float
    ) -> Tuple[float, float]:
        """Calculate distance using the user's known height"""
        top_head = landmarks[PoseLandmark.NOSE].y * image_height
        bottom_foot = max(
            landmarks[PoseLandmark.LEFT_ANKLE].y,
            landmarks[PoseLandmark.RIGHT_ANKLE].y
        ) * image_height
        
        person_height_px = abs(bottom_foot - top_head)
        
        # Using the formula: distance = (actual_height_cm * focal_length) / height_in_pixels
        distance = (user_height_cm * FOCAL_LENGTH) / person_height_px
        
        # Calculate more accurate scale_factor based on known height
        scale_factor = user_height_cm / person_height_px
        
        return distance, scale_factor
    
    @staticmethod
    def get_body_width_at_height(frame: np.ndarray, height_px: int, center_x: float) -> float:
        """Scan horizontally at a specific height to find body edges"""
        # Convert to grayscale and apply threshold
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(blur, 50, 255, cv2.THRESH_BINARY)
        
        # Ensure height_px is within image bounds
        if height_px >= frame.shape[0]:
            height_px = frame.shape[0] - 1
        
        # Get horizontal line at the specified height
        horizontal_line = thresh[height_px, :]
        
        # Find left and right edges starting from center
        center_x = int(center_x * frame.shape[1])
        left_edge, right_edge = center_x, center_x
        
        # Scan from center to left
        for i in range(center_x, 0, -1):
            if horizontal_line[i] == 0:  # Found edge (black pixel)
                left_edge = i
                break
        
        # Scan from center to right
        for i in range(center_x, len(horizontal_line)):
            if horizontal_line[i] == 0:  # Found edge (black pixel)
                right_edge = i
                break
                
        width_px = right_edge - left_edge
        
        # If width is unreasonably small, apply a minimum width
        min_width = 0.1 * frame.shape[1]  # Minimum width as 10% of image width
        if width_px < min_width:
            width_px = min_width
            
        return width_px
    
    def calculate_measurements(
        self,
        results,
        scale_factor: float,
        image_width: int,
        image_height: int,
        depth_map: Optional[np.ndarray],
        frame: Optional[np.ndarray] = None,
        user_height_cm: Optional[float] = None
    ) -> Dict[str, float]:
        """Calculate body measurements from pose landmarks"""
        landmarks = results.pose_landmarks.landmark

        # If user's height is provided, use it to get a more accurate scale factor
        if user_height_cm:
            _, scale_factor = self.calculate_distance_using_height(
                landmarks, image_height, user_height_cm
            )

        def pixel_to_cm(value: float) -> float:
            return round(value * scale_factor, 2)
        
        def calculate_circumference(width_px: float, depth_ratio: float = 1.0) -> float:
            """Estimate circumference using width and depth adjustment"""
            # Using a simplified elliptical approximation: C ≈ 2π * sqrt((a² + b²)/2)
            width_cm = width_px * scale_factor
            estimated_depth_cm = width_cm * depth_ratio * 0.7  # Depth is typically ~70% of width for torso
            half_width = width_cm / 2
            half_depth = estimated_depth_cm / 2
            return round(2 * np.pi * np.sqrt((half_width**2 + half_depth**2) / 2), 2)

        measurements = {}

        # Shoulder Width
        left_shoulder = landmarks[PoseLandmark.LEFT_SHOULDER]
        right_shoulder = landmarks[PoseLandmark.RIGHT_SHOULDER]
        shoulder_width_px = abs(left_shoulder.x * image_width - right_shoulder.x * image_width)
        
        shoulder_correction = 1.1  # 10% wider
        shoulder_width_px *= shoulder_correction
        
        measurements["shoulder_width"] = pixel_to_cm(shoulder_width_px)

        # Chest/Bust Measurement
        chest_y_ratio = 0.15  # Approximately 15% down from shoulder to hip
        chest_y = left_shoulder.y + (landmarks[PoseLandmark.LEFT_HIP].y - left_shoulder.y) * chest_y_ratio
        
        chest_correction = 1.15  # 15% wider than detected width
        chest_width_px = abs((right_shoulder.x - left_shoulder.x) * image_width) * chest_correction
        
        if frame is not None:
            chest_y_px = int(chest_y * image_height)
            center_x = (left_shoulder.x + right_shoulder.x) / 2
            detected_width = self.get_body_width_at_height(frame, chest_y_px, center_x)
            if detected_width > 0:
                chest_width_px = max(chest_width_px, detected_width)
        
        chest_depth_ratio = 1.0
        if depth_map is not None:
            chest_x = int(((left_shoulder.x + right_shoulder.x) / 2) * image_width)
            chest_y_px = int(chest_y * image_height)
            scale_y = 384 / image_height
            scale_x = 384 / image_width
            chest_y_scaled = int(chest_y_px * scale_y)
            chest_x_scaled = int(chest_x * scale_x)
            if 0 <= chest_y_scaled < 384 and 0 <= chest_x_scaled < 384:
                chest_depth = depth_map[chest_y_scaled, chest_x_scaled]
                max_depth = np.max(depth_map)
                chest_depth_ratio = 1.0 + 0.5 * (1.0 - chest_depth / max_depth)
        
        measurements["chest_width"] = pixel_to_cm(chest_width_px)
        measurements["chest_circumference"] = calculate_circumference(chest_width_px, chest_depth_ratio)

        # Waist Measurement
        left_hip = landmarks[PoseLandmark.LEFT_HIP]
        right_hip = landmarks[PoseLandmark.RIGHT_HIP]

        waist_y_ratio = 0.35  # 35% down from shoulder to hip
        waist_y = left_shoulder.y + (left_hip.y - left_shoulder.y) * waist_y_ratio

        if frame is not None:
            waist_y_px = int(waist_y * image_height)
            center_x = (left_hip.x + right_hip.x) / 2
            detected_width = self.get_body_width_at_height(frame, waist_y_px, center_x)
            if detected_width > 0:
                waist_width_px = detected_width
            else:
                waist_width_px = abs(right_hip.x - left_hip.x) * image_width * 0.9
        else:
            waist_width_px = abs(right_hip.x - left_hip.x) * image_width * 0.9

        waist_correction = 1.16  # 16% wider
        waist_width_px *= waist_correction

        waist_depth_ratio = 1.0
        if depth_map is not None:
            waist_x = int(((left_hip.x + right_hip.x) / 2) * image_width)
            waist_y_px = int(waist_y * image_height)
            scale_y = 384 / image_height
            scale_x = 384 / image_width
            waist_y_scaled = int(waist_y_px * scale_y)
            waist_x_scaled = int(waist_x * scale_x)
            if 0 <= waist_y_scaled < 384 and 0 <= waist_x_scaled < 384:
                waist_depth = depth_map[waist_y_scaled, waist_x_scaled]
                max_depth = np.max(depth_map)
                waist_depth_ratio = 1.0 + 0.5 * (1.0 - waist_depth / max_depth)

        measurements["waist_width"] = pixel_to_cm(waist_width_px)
        measurements["waist"] = calculate_circumference(waist_width_px, waist_depth_ratio)

        # Hip Measurement
        hip_correction = 1.35  # Hips are typically 35% wider
        hip_width_px = abs(left_hip.x * image_width - right_hip.x * image_width) * hip_correction
        
        if frame is not None:
            hip_y_offset = 0.1  # 10% down from hip landmarks
            hip_y = left_hip.y + (landmarks[PoseLandmark.LEFT_KNEE].y - left_hip.y) * hip_y_offset
            hip_y_px = int(hip_y * image_height)
            center_x = (left_hip.x + right_hip.x) / 2
            detected_width = self.get_body_width_at_height(frame, hip_y_px, center_x)
            if detected_width > 0:
                hip_width_px = max(hip_width_px, detected_width)
        
        hip_depth_ratio = 1.0
        if depth_map is not None:
            hip_x = int(((left_hip.x + right_hip.x) / 2) * image_width)
            hip_y_px = int(left_hip.y * image_height)
            scale_y = 384 / image_height
            scale_x = 384 / image_width
            hip_y_scaled = int(hip_y_px * scale_y)
            hip_x_scaled = int(hip_x * scale_x)
            if 0 <= hip_y_scaled < 384 and 0 <= hip_x_scaled < 384:
                hip_depth = depth_map[hip_y_scaled, hip_x_scaled]
                max_depth = np.max(depth_map)
                hip_depth_ratio = 1.0 + 0.5 * (1.0 - hip_depth / max_depth)
        
        measurements["hip_width"] = pixel_to_cm(hip_width_px)
        measurements["hip"] = calculate_circumference(hip_width_px, hip_depth_ratio)

        # Neck
        neck = landmarks[PoseLandmark.NOSE]
        left_ear = landmarks[PoseLandmark.LEFT_EAR]
        neck_width_px = abs(neck.x * image_width - left_ear.x * image_width) * 2.0
        measurements["neck"] = calculate_circumference(neck_width_px, 1.0)
        measurements["neck_width"] = pixel_to_cm(neck_width_px)

        # Arm Length
        left_wrist = landmarks[PoseLandmark.LEFT_WRIST]
        sleeve_length_px = abs(left_shoulder.y * image_height - left_wrist.y * image_height)
        measurements["arm_length"] = pixel_to_cm(sleeve_length_px)

        # Shirt Length
        shirt_length_px = abs(left_shoulder.y * image_height - left_hip.y * image_height) * 1.2
        measurements["shirt_length"] = pixel_to_cm(shirt_length_px)

        # Thigh Circumference
        thigh_y_ratio = 0.2  # 20% down from hip to knee
        left_knee = landmarks[PoseLandmark.LEFT_KNEE]
        thigh_y = left_hip.y + (left_knee.y - left_hip.y) * thigh_y_ratio
        
        thigh_correction = 1.2  # Thighs are typically wider
        thigh_width_px = hip_width_px * 0.5 * thigh_correction
        
        if frame is not None:
            thigh_y_px = int(thigh_y * image_height)
            thigh_x = left_hip.x * 0.9
            detected_width = self.get_body_width_at_height(frame, thigh_y_px, thigh_x)
            if detected_width > 0 and detected_width < hip_width_px:
                thigh_width_px = detected_width
        
        thigh_depth_ratio = 1.0
        if depth_map is not None:
            thigh_x = int(left_hip.x * image_width)
            thigh_y_px = int(thigh_y * image_height)
            scale_y = 384 / image_height
            scale_x = 384 / image_width
            thigh_y_scaled = int(thigh_y_px * scale_y)
            thigh_x_scaled = int(thigh_x * scale_x)
            
            if 0 <= thigh_y_scaled < 384 and 0 <= thigh_x_scaled < 384:
                thigh_depth = depth_map[thigh_y_scaled, thigh_x_scaled]
                max_depth = np.max(depth_map)
                thigh_depth_ratio = 1.0 + 0.5 * (1.0 - thigh_depth / max_depth)
        
        measurements["thigh"] = pixel_to_cm(thigh_width_px)
        measurements["thigh_circumference"] = calculate_circumference(thigh_width_px, thigh_depth_ratio)

        # Trouser Length
        left_ankle = landmarks[PoseLandmark.LEFT_ANKLE]
        trouser_length_px = abs(left_hip.y * image_height - left_ankle.y * image_height)
        measurements["trouser_length"] = pixel_to_cm(trouser_length_px)

        return measurements
    
    def validate_front_image(self, image_np: np.ndarray) -> Tuple[bool, str]:
        try:
            rgb_frame = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
            image_height, image_width = image_np.shape[:2]
            
            # Convert to MediaPipe Image format
            mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
            
            # Detect pose using new Tasks API
            detection_result = self.pose_landmarker.detect(mp_image)
            
            if not detection_result.pose_landmarks or len(detection_result.pose_landmarks) == 0:
                return False, "No person detected. Please make sure you're clearly visible in the frame."

            # Get first person's landmarks
            pose_landmarks = detection_result.pose_landmarks[0]

            # Minimum required landmark indices
            MINIMUM_LANDMARKS = [
                PoseLandmark.NOSE,
                PoseLandmark.LEFT_SHOULDER,
                PoseLandmark.RIGHT_SHOULDER,
                PoseLandmark.LEFT_ELBOW,
                PoseLandmark.RIGHT_ELBOW,
                PoseLandmark.RIGHT_KNEE,
                PoseLandmark.LEFT_KNEE
            ]
            
            # Verify minimum landmarks are detected
            missing_upper = []
            for landmark_idx in MINIMUM_LANDMARKS:
                landmark_data = pose_landmarks[landmark_idx]
                if (landmark_data.visibility < 0.5 or
                    landmark_data.x < 0 or 
                    landmark_data.x > 1 or
                    landmark_data.y < 0 or 
                    landmark_data.y > 1):
                    missing_upper.append(f"Landmark_{landmark_idx}")
            
            if missing_upper:
                return False, "Couldn't detect full body. Please make sure your full body is visible."

            # Check if this might be just a face/selfie
            nose = pose_landmarks[PoseLandmark.NOSE]
            left_shoulder = pose_landmarks[PoseLandmark.LEFT_SHOULDER]
            right_shoulder = pose_landmarks[PoseLandmark.RIGHT_SHOULDER]
            
            shoulder_width = abs(left_shoulder.x - right_shoulder.x) * image_width
            head_to_shoulder = abs(left_shoulder.y - nose.y) * image_height
            
            if shoulder_width < head_to_shoulder * 1.2:
                return False, "Please step back to show more of your upper body, not just your face."

            return True, "Validation passed - proceeding with measurements"
            
        except Exception as e:
            return False, f"Error validating body image: {str(e)}"
    
    def process_body_measurement(
        self,
        front_image: bytes,
        user_height_cm: float = DEFAULT_HEIGHT_CM,
        side_image: Optional[bytes] = None
    ) -> Tuple[Dict[str, float], Dict[str, float]]:

        # Decode front image
        front_image_np = np.frombuffer(front_image, np.uint8)
        front_frame = cv2.imdecode(front_image_np, cv2.IMREAD_COLOR)
        
        # Validate front image
        is_valid, error_msg = self.validate_front_image(front_frame)
        if not is_valid:
            raise ValueError(error_msg)
        
        # Process front image with new Tasks API
        rgb_frame = cv2.cvtColor(front_frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        detection_result = self.pose_landmarker.detect(mp_image)
        
        image_height, image_width, _ = front_frame.shape
        
        if not detection_result.pose_landmarks or len(detection_result.pose_landmarks) == 0:
            raise ValueError("Could not detect pose landmarks in the image")
        
        # Get first person's landmarks
        pose_landmarks = detection_result.pose_landmarks[0]
        
        # Calculate scale factor using height
        _, scale_factor = self.calculate_distance_using_height(
            pose_landmarks,
            image_height,
            user_height_cm
        )
        
        # Estimate depth
        depth_map = self.estimate_depth(front_frame)
        
        # Create a result object compatible with the calculate_measurements method
        class PoseResult:
            def __init__(self, landmarks):
                self.pose_landmarks = type('obj', (object,), {'landmark': landmarks})()
        
        results = PoseResult(pose_landmarks)
        
        # Calculate measurements
        measurements = self.calculate_measurements(
            results,
            scale_factor,
            image_width,
            image_height,
            depth_map,
            front_frame,
            user_height_cm
        )
        
        debug_info = {
            "scale_factor": float(scale_factor),
            "focal_length": float(FOCAL_LENGTH),
            "user_height_cm": float(user_height_cm)
        }
        
        return measurements, debug_info
    
    def __del__(self):
        """Cleanup resources"""
        try:
            if hasattr(self, 'pose_landmarker'):
                self.pose_landmarker.close()
        except Exception:
            pass
