import os
import cv2
import sys
import numpy as np
import mediapipe as mp
from keras.models import load_model

def translate_sign_language_video(video_path):
    print(f"📹 Processing video: {video_path}")
    # Check if the video file exists
    if not os.path.exists(video_path):
        print(f"❌ Video file not found: {video_path}")
        return

    # Load the model
    try:
        model = load_model('hattay.keras')
    except Exception as e:
        print(f"❌ Failed to load model 'hattay.keras': {str(e)}")
        return

    # Define label map for the provided translations
    labels = ['hello', 'thanks', 'iloveyou', 'book']
    label_map = {label: idx for idx, label in enumerate(labels)}
    reverse_label_map = {idx: label for idx, label in enumerate(labels)}

    # Mediapipe setup
    mp_holistic = mp.solutions.holistic.Holistic(
        static_image_mode=False,
        model_complexity=1,
        enable_segmentation=False,
        refine_face_landmarks=True
    )
    mp_drawing = mp.solutions.drawing_utils

    # Function to extract keypoints from a Mediapipe result
    def extract_keypoints(results):
        pose = np.array([[res.x, res.y, res.z, res.visibility] 
                        for res in results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(132)
        lh = np.array([[res.x, res.y, res.z] 
                      for res in results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(63)
        rh = np.array([[res.x, res.y, res.z] 
                      for res in results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(63)
        face = np.array([[res.x, res.y, res.z] 
                        for res in results.face_landmarks.landmark]).flatten() if results.face_landmarks else np.zeros(1404)
        return np.concatenate([face, pose, lh, rh])

    # Function for Mediapipe detection
    def mediapipe_detection(image, model):
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        results = model.process(image)
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        return image, results

    # Process video to extract keypoints and predict translations
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"❌ Cannot open video: {video_path}. Ensure the file is a valid video format (e.g., .mp4).")
        mp_holistic.close()
        return

    keypoints_buffer = []
    frame_buffer = []
    translations = []
    frame_indices = []
    count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            print(f"⚠️ End of video or failed to read frame from {video_path}.")
            break
        
        count += 1
        image, results = mediapipe_detection(frame, mp_holistic)
        keypoints = extract_keypoints(results)
        keypoints = keypoints[:1662]  # Truncate to 1662 keypoints
        keypoints_buffer.append(keypoints)
        frame_buffer.append(frame)

        # Process when 30 frames are collected or at the end
        if len(keypoints_buffer) == 30 or (not ret and keypoints_buffer):
            # Pad if fewer than 30 frames
            if len(keypoints_buffer) < 30:
                padding = [np.zeros(1662) for _ in range(30 - len(keypoints_buffer))]
                keypoints_buffer.extend(padding)
            
            # Convert to numpy array and predict
            vid_array = np.array(keypoints_buffer)
            X = np.array([vid_array])  # Shape: (1, 30, 1662)
            try:
                prediction = model.predict(X, verbose=0)
                predicted_label = np.argmax(prediction, axis=1)[0]
                translation = reverse_label_map.get(predicted_label, "Unknown")
            except Exception as e:
                print(f"❌ Prediction failed: {str(e)}")
                mp_holistic.close()
                cap.release()
                return
            
            # Assign translation to the frames in this chunk
            translations.extend([translation] * len(frame_buffer))
            frame_indices.extend(range(count - len(frame_buffer), count))
            
            # Reset buffers
            keypoints_buffer = []
            frame_buffer = []

    cap.release()

    if not frame_indices:
        print(f"❌ No frames processed from {video_path}. Video may be empty or invalid.")
        mp_holistic.close()
        return

    # Display video with translations
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print(f"❌ Cannot re-open video for display: {video_path}")
        mp_holistic.close()
        return

    current_frame = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        current_frame += 1
        # Find the translation for this frame
        translation = "Unknown"
        for idx, frame_idx in enumerate(frame_indices):
            if frame_idx == current_frame:
                translation = translations[idx]
                break

        # Overlay translation text on frame
        cv2.putText(frame, f"Translation: {translation}", (50, 50), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        
        # Display the frame
        cv2.imshow('Sign Language Video', frame)
        
        # Press 'q' to quit
        if cv2.waitKey(30) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    mp_holistic.close()

# Example usage
if __name__ == "__main__":
   path = r"C:\Users\MSI\Desktop\70212.mp4"

   translate_sign_language_video(path)