import numpy as np
import pandas as pd
from typing import Dict, Tuple
from app.core.logging import get_logger

logger = get_logger(__name__)


class DataPreprocessor:
    
    def __init__(self):
        self.processed_df = None
        
    def load_stats_from_data(self, data_path: str = None):
        if data_path is None:
            data_path = "data/final_test.csv"
        
        try:
            df = pd.read_csv(data_path)
    
            dfs = []
            sizes = []
            
            for size_type in df["size"].unique():
                sizes.append(size_type)
                ndf = df[['age', 'height', 'weight']][df['size'] == size_type]
                zscore = ((ndf - ndf.mean()) / ndf.std())
                dfs.append(zscore)
            
            for i in range(len(dfs)):
                dfs[i]['age'] = dfs[i]['age'][(dfs[i]['age'] > -3) & (dfs[i]['age'] < 3)]
                dfs[i]['height'] = dfs[i]['height'][(dfs[i]['height'] > -3) & (dfs[i]['height'] < 3)]
                dfs[i]['weight'] = dfs[i]['weight'][(dfs[i]['weight'] > -3) & (dfs[i]['weight'] < 3)]
            
            for i in range(len(sizes)):
                dfs[i]['size'] = sizes[i]
            
            self.processed_df = pd.concat(dfs)
            
            logger.info(f"Loaded and preprocessed data from {data_path}")
            logger.debug(f"Processed dataframe shape: {self.processed_df.shape}")
            
        except Exception as e:
            logger.warning(f"Could not load stats from {data_path}: {e}")
            logger.warning("Using default normalization (no preprocessing)")
    
    def preprocess_input(self, age: float, height: float, weight: float) -> pd.DataFrame:
        input_data = pd.DataFrame([{
            'age': age,
            'height': height,
            'weight': weight
        }])
        
        if self.processed_df is not None:
            features = ['age', 'height', 'weight']
            for feature in features:
                mean = self.processed_df[feature].mean()
                std = self.processed_df[feature].std()
                if std > 0:
                    input_data[feature] = (input_data[feature] - mean) / std
                else:
                    logger.warning(f"Standard deviation for {feature} is 0, skipping normalization")
        else:
            logger.warning("No processed data available, using raw input")
        
        for feature in ['age', 'height', 'weight']:
            z_score = input_data[feature].iloc[0]
            if abs(z_score) > 3:
                logger.warning(f"{feature} z-score ({z_score:.2f}) is outside normal range (-3 to 3)")
                input_data[feature] = np.clip(input_data[feature], -3, 3)
        
        logger.debug(f"Preprocessed input: {input_data.to_dict('records')[0]}")
        
        return input_data
    
    def postprocess_output(self, predicted_size: int) -> str:
        size_mapping = {
            1: "XXS",
            2: "S",
            3: "M",
            4: "L",
            5: "XL",
            6: "XXL",
            7: "XXXL"
        }
        
        return size_mapping.get(int(predicted_size), f"Size_{predicted_size}")
    
    def get_size_number(self, size_label: str) -> int:
        label_mapping = {
            "XXS": 1,
            "S": 2,
            "M": 3,
            "L": 4,
            "XL": 5,
            "XXL": 6,
            "XXXL": 7
        }
        
        return label_mapping.get(size_label.upper(), 3)
