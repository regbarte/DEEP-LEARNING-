import numpy as np
from PIL import Image

def prepare_image(image_bytes):
    # 1. Load, Convert to RGB, and Resize
    # MUST be 224x224 now to match your new ResNet50 model
    img = Image.open(image_bytes).convert("RGB")
    img = img.resize((224, 224)) 
    
    # 2. Convert to Array
    img_array = np.array(img).astype('float32')
    
    # 3. MATCHING COLAB PREPROCESSING
    # Since we used ImageDataGenerator(rescale=1./255) in Colab,
    # we must do exactly the same here.
    img_array /= 255.0 
    
    # 4. Official ResNet50 Preprocessing (SKIP THIS)
    # We are SKIPPING preprocess_input(img_array) because we used 
    # the 1/255 manual scaling during training. 
    # Using both will confuse the model!
    
    # 5. Add batch dimension (1, 224, 224, 3)
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array