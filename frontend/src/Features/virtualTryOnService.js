//  Dummy Virtual Try-On Service
//  replace with a real API call.

export async function generateTryOn(userImage, productImage) {
  console.log("User Image:", userImage);
  console.log("Product Image:", productImage);

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Demo Output:
  // For now we just return the user image as the "result"
  // Later this will return try-on image
  return userImage;
}
