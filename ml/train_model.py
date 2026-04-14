import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# 1. Load dataset
data = pd.read_csv("claims_dataset.csv")

print("Dataset loaded successfully!")
print(data.head())

# 2. Drop claim_id because it's not useful for prediction
data = data.drop("claim_id", axis=1)

# 3. Split into input (X) and output (y)
X = data.drop("label", axis=1)
y = data["label"]

# 4. Split into train and test set (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 5. Train model (Random Forest Classifier)
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

print("\nModel training complete!")

# 6. Predict on test set
y_pred = model.predict(X_test)

# 7. Print evaluation results
print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# 8. Save model to file
joblib.dump(model, "fraud_model.pkl")

print("\nModel saved successfully as fraud_model.pkl")