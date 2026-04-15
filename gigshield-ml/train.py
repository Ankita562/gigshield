"""
GigShield — XGBoost Fraud Classifier
Run AFTER generate_data.py:  python train.py
Outputs: model.pkl, feature_importance.png, confusion_matrix.png
"""

import pandas as pd
import numpy as np
import pickle
import matplotlib.pyplot as plt
import seaborn as sns

from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.metrics import (classification_report, confusion_matrix,
                             roc_auc_score, roc_curve, ConfusionMatrixDisplay)
from sklearn.preprocessing import LabelEncoder
from imblearn.over_sampling import SMOTE

# ── 1. Load data ───────────────────────────────────────────────────────────────
df = pd.read_csv('gigshield_claims.csv')
print(f"Loaded {len(df)} rows. Fraud rate: {df['is_fraud'].mean():.1%}\n")

# ── 2. Feature selection ───────────────────────────────────────────────────────
FEATURES = [
    # Telemetry — your 3 core signals
    'velocity_flag',
    'device_flag',
    'weather_flag',
    'velocity_kmh',
    'device_accounts_today',

    # Claim details
    'claim_type_enc',
    'claim_amount_inr',
    'photo_submitted',

    # Worker profile
    'days_since_joining',
    'claims_last_30_days',
    'worker_age',

    # Environmental context
    'actual_rainfall_mm',
    'actual_aqi',
    'actual_temp_c',
    'claimed_aqi_severe',

    # Behavioural
    'hour_of_day',
    'day_of_week',
    'mins_since_shift_start',
    'zone_claims_last_hour',
    'zone_enc',
]

X = df[FEATURES]
y = df['is_fraud']

# ── 3. Train / test split ──────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── 4. Handle class imbalance with SMOTE ──────────────────────────────────────
smote = SMOTE(random_state=42)
X_train_bal, y_train_bal = smote.fit_resample(X_train, y_train)
print(f"After SMOTE — train size: {len(X_train_bal)}, fraud: {y_train_bal.mean():.1%}\n")

# ── 5. Train XGBoost ──────────────────────────────────────────────────────────
model = XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    scale_pos_weight=1,   # balanced via SMOTE already
    random_state=42,
    eval_metric='logloss',
    verbosity=0,
)
model.fit(X_train_bal, y_train_bal)
print("Model trained.\n")

# ── 6. Evaluate ───────────────────────────────────────────────────────────────
y_pred      = model.predict(X_test)
y_prob      = model.predict_proba(X_test)[:, 1]
auc         = roc_auc_score(y_test, y_prob)

print("=" * 50)
print(f"ROC-AUC Score: {auc:.4f}")
print("=" * 50)
print(classification_report(y_test, y_pred, target_names=['Legit', 'Fraud']))

# Cross-validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(model, X, y, cv=cv, scoring='roc_auc')
print(f"5-Fold CV AUC: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}\n")

# ── 7. Confusion matrix plot ───────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

cm = confusion_matrix(y_test, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=['Legit', 'Fraud'])
disp.plot(ax=axes[0], colorbar=False, cmap='Blues')
axes[0].set_title('Confusion Matrix', fontsize=14, fontweight='bold')

# ROC curve
fpr, tpr, _ = roc_curve(y_test, y_prob)
axes[1].plot(fpr, tpr, color='#534AB7', lw=2, label=f'AUC = {auc:.3f}')
axes[1].plot([0,1],[0,1], 'k--', lw=1)
axes[1].set_xlabel('False Positive Rate')
axes[1].set_ylabel('True Positive Rate')
axes[1].set_title('ROC Curve', fontsize=14, fontweight='bold')
axes[1].legend()
axes[1].set_facecolor('#f8f8f8')

plt.tight_layout()
plt.savefig('model_evaluation.png', dpi=150, bbox_inches='tight')
plt.close()
print("Saved model_evaluation.png")

# ── 8. Feature importance plot ────────────────────────────────────────────────
importance = pd.Series(model.feature_importances_, index=FEATURES).sort_values(ascending=True)

plt.figure(figsize=(9, 7))
colors = ['#534AB7' if importance[f] > importance.median() else '#AFA9EC' for f in importance.index]
importance.plot(kind='barh', color=colors)
plt.xlabel('Feature Importance (gain)')
plt.title('GigShield Fraud Model — Feature Importance', fontsize=13, fontweight='bold')
plt.tight_layout()
plt.savefig('feature_importance.png', dpi=150, bbox_inches='tight')
plt.close()
print("Saved feature_importance.png")

# ── 9. Save model ─────────────────────────────────────────────────────────────
pickle.dump({'model': model, 'features': FEATURES}, open('model.pkl', 'wb'))
print("\nmodel.pkl saved. Ready for FastAPI.\n")
print("Features your model expects (in order):")
for f in FEATURES:
    print(f"  - {f}")