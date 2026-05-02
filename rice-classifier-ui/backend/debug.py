import os
import tensorflow as tf
import numpy as np

# Silence logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

model_path = 'model/final_rice_model.keras'

print(f"--- THE FINAL TEST (TF: {tf.__version__}) ---")

try:
    # Load the model
    model = tf.keras.models.load_model(model_path)
    print("✅ MODEL LOADED!")
    
    # Run a test prediction
    dummy_input = np.random.rand(1, 100, 100, 3).astype('float32')
    prediction = model.predict(dummy_input, verbose=0)
    
    print(f"✅ PREDICTION SUCCESSFUL: {prediction}")
    print("\nYour backend is officially ready for the UI.")

except Exception as e:
    print(f"❌ ERROR: {e}")