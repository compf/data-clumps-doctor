import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import math
import csv


NaNsingleNodeGroups_median = 97.96
singleNodeGroups= [
  95,
  97.89,
  97.89,
  92.31,
  97.96,
  97.5,
  97.5,
  98.86,
  97.8,
  96.92,
  98.18,
  93.42,
  96.25,
  98.18,
  94.96,
  97.89,
  95,
  97.8,
  96.43,
  94.87,
  92.31,
  93.42,
  95.54,
  94.87,
  98.18,
  97.8,
  97.8,
  96.25,
  94.87,
  98.31,
  94.87,
  97.8,
  94.26,
  92.31,
  93.42,
  96.25,
  94.26,
  97.8,
  98.31,
  98.18,
  94.87,
  95.62,
  97.28,
  95,
  94.87,
  97.5,
  97.28,
  92.86,
  95.62,
  92.41,
  97.7,
  94.26,
  92.42,
  92.31,
  97.44,
  98.75,
  95.83,
  97.5,
  96.97,
  95.62,
  94.78,
  97.44,
  93.42,
  94.26,
  97.78,
  97.5,
  93.42,
  99.06,
  97.5,
  97.8,
  92.31,
  98.61,
  95.62,
  98.84,
  93.42,
  95.12,
  98.84,
  98.18,
  95.62,
  95.62,
  94.26,
  98.84,
  94.96,
  95.12,
  98.84,
  97.5,
  97.58,
  96.25,
  97.5,
  95.62,
  97.8,
  94.26,
  96.92,
  96.43,
  95.62,
  95,
  92.86,
  98.78,
  94.26,
  98.53,
  97.46,
  94.87,
  97.8,
  96.25,
  97.8,
  97.5,
  98.18,
  96.25,
  98.84,
  98.84,
  97.32,
  95.62,
  92.31,
  94.78,
  93.42,
  94.87,
  95.62,
  97.89,
  97.5,
  96.25,
  96.25,
  97.69,
  97.96,
  97.89,
  97.89,
  92.34,
  98.11,
  94.26,
  94.26,
  92.86,
  97.5,
  97.53,
  94.26,
  97.5,
  97.8,
  92.31,
  94.87,
  98.18,
  93.42,
  97.8,
  97.97,
  96.25,
  97.5,
  97.5,
  96.25,
  98.51,
  95.62,
  92.31,
  97.54,
  92.86,
  97.5,
  94.26,
  97.89,
  98.78,
  97.8,
  97.3,
  96.25,
  97.8,
  97.5,
  98.75,
  97.5,
  97.89,
  94.87,
  97.67,
  96.25,
  94.26,
  97.8,
  96.25,
  98.78,
  97.89,
  98.18,
  98.18,
  98.84,
  96.25,
  93.42,
  94.26,
  97.5,
  94.26,
  98.11,
  95.88,
  98.48,
  95.74,
  99.78,
  99.78,
  98.81,
  97.86,
  97.78,
  98.7,
  99.73,
  95.62,
  97.78,
  98.48,
  98.81,
  94.57,
  98.54,
  98.93,
  95.68,
  97.62,
  95.93,
  97.62,
  97.88,
  97.88,
  97.81,
  97.88,
  98.7,
  98.36,
  95.12,
  97.78,
  98.54,
  98.37,
  97.78,
  98.7,
  98.93,
  98.7,
  98.36,
  99.73,
  99.09,
  99.73,
  98.7,
  99.73,
  97.65,
  97.78,
  97.78,
  98.48,
  95.28,
  99.16,
  99.73,
  95.88,
  99.78,
  97.88,
  99.78,
  98.72,
  98.7,
  98.36,
  98.72,
  97.61,
  97.86,
  94.57,
  97.62,
  97.88,
  97.86,
  97.81,
  99.78,
  97.78,
  97.88,
  97.86,
  97.88,
  99.6,
  99.17,
  99.4,
  99.18,
  99.41,
  99.21,
  99.41,
  99.17,
  99.41,
  99.41,
  99.19,
  99.4,
  99.46,
  99.41,
  99.41,
  99.18,
  98.89,
  99.35,
  99.15,
  99.21,
  99.55,
  99.14,
  98.86,
  99.17,
  99.65,
  99.31,
  99.45,
  99.65,
  99.17,
  99.17,
  99.21,
  99.17,
  99.51,
  99.19,
  99.17,
  99.41,
  99.35,
  99.6,
  99.41,
  99.41,
  99.41,
  99.6,
  99.17,
  99.41,
  99.6,
  99.41,
  99.4,
  99.31,
  99.19,
  99.41,
  83.33,
  98.96,
  98.15,
  98.58,
  99.64,
  99.48,
  98.34,
  98.86,
  83.33,
  97.94,
  99.6,
  75,
  99.6,
  98.34,
  99.64,
  99.6,
  98.73,
  80,
  97.94,
  97.94,
  99.61,
  95.5,
  95.5,
  98.94,
  98.91,
  97.94,
  83.33,
  97.98,
  93.85,
  99.62,
  99.61,
  99.65,
  99.65,
  99.62,
  99.62,
  99.61,
  98.2,
  97.9,
  98.6,
  97.63,
  98.93,
  97.36,
  98.05,
  98.15,
  98.2,
  97.47,
  98.28,
  97.91,
  98.89,
  97.53,
  97.61,
  98.2,
  97.86,
  97.53,
  97.67,
  97.92,
  98.79,
  98.19,
  97.53,
  97.62,
  98.13,
  98.73,
  98.89,
  97.92,
  98.58,
  98.9,
  99.44,
  97.36,
  97.36,
  98.06,
  98.19,
  97.36,
  99.35,
  97.09,
  98.74,
  99.04,
  98.85,
  98.71,
  98.58,
  97.36,
  97.75,
  98.49,
  98.72,
  99.09,
  98.88,
  97.76,
  98.97,
  98.78,
  97.34,
  98.87,
  99.39,
  98.48,
  98.95,
  98.49,
  98.8,
  97.13,
  97.09,
  98.89,
  98.86,
  97.13,
  98.35,
  99.2,
  98.8,
  98.69,
  98.49,
  99.27,
  98.36,
  98.48,
  98.49,
  98.84,
  99.2,
  98.06,
  98.14,
  98.93,
  98.94,
  98.38,
  98.69,
  98.92,
  97.75,
  98.85,
  97.13,
  98.64,
  99.1,
  98.49,
  98.93,
  97.36,
  99.35,
  98.49,
  98.49,
  98.89,
  97.75,
  98.89,
  98.79,
  98.94,
  98.48,
  98.49,
  97.46,
  98.49,
  98.49,
  98.48,
  98.79,
  99.39,
  98.26,
  97.46,
  98.89,
  97.76,
  98.98,
  98.86,
  97.13,
  99.09,
  97.36,
  97.13,
  98.78,
  98.54,
  98.87,
  98.89,
  98.89,
  98.48,
  98.79,
  98.33,
  98.26,
  98.89,
  97.7,
  97.32
]


NaNtwoNodeGroups_median = 1.27
twoNodeGroups= [
  4.17,
  2.11,
  2.11,
  6.41,
  2.04,
  2.5,
  2.5,
  0,
  2.2,
  3.08,
  0,
  5.26,
  3.75,
  0,
  4.32,
  2.11,
  4.17,
  2.2,
  3.57,
  4.27,
  6.41,
  5.26,
  3.57,
  4.27,
  0,
  2.2,
  2.2,
  3.75,
  4.27,
  0,
  4.27,
  2.2,
  4.92,
  6.41,
  5.26,
  3.75,
  4.92,
  2.2,
  0,
  1.82,
  4.27,
  3.65,
  2.72,
  4.17,
  4.27,
  2.5,
  2.72,
  5.71,
  3.65,
  6.25,
  1.72,
  4.92,
  6.06,
  6.41,
  2.56,
  0.63,
  4.17,
  2.5,
  3.03,
  3.65,
  4.35,
  2.56,
  5.26,
  4.92,
  2.22,
  2.5,
  5.26,
  0.94,
  2.5,
  2.2,
  6.41,
  0.69,
  3.65,
  0,
  5.26,
  4.07,
  0,
  0,
  3.65,
  3.65,
  4.92,
  0,
  4.2,
  4.07,
  0,
  2.5,
  0.81,
  3.75,
  2.5,
  3.65,
  2.2,
  4.92,
  3.08,
  3.57,
  3.65,
  4.17,
  5.71,
  0,
  4.92,
  0.74,
  2.54,
  4.27,
  2.2,
  3.75,
  2.2,
  2.5,
  0,
  3.75,
  0,
  0,
  2.68,
  3.65,
  6.41,
  4.35,
  5.26,
  4.27,
  3.65,
  2.11,
  2.5,
  3.75,
  3.75,
  2.31,
  2.04,
  2.11,
  2.11,
  6.31,
  1.89,
  4.92,
  4.92,
  7.14,
  2.5,
  1.85,
  4.92,
  2.5,
  2.2,
  6.41,
  4.27,
  0,
  5.26,
  2.2,
  1.35,
  3.75,
  2.5,
  2.5,
  3.75,
  0.75,
  3.65,
  6.41,
  2.46,
  7.14,
  2.5,
  4.92,
  2.11,
  0,
  2.2,
  2.7,
  3.75,
  2.2,
  2.5,
  0.63,
  2.5,
  2.11,
  4.27,
  1.74,
  3.75,
  4.92,
  2.2,
  3.75,
  0,
  2.11,
  1.82,
  1.82,
  0,
  3.75,
  5.26,
  4.92,
  2.5,
  4.92,
  1.89,
  2.94,
  1.05,
  3.55,
  0.1,
  0.1,
  0.95,
  1.6,
  1.78,
  0.83,
  0.12,
  4.38,
  1.78,
  1.05,
  0.84,
  4.65,
  1.17,
  0.59,
  3.6,
  1.85,
  4.07,
  1.85,
  1.59,
  1.65,
  1.56,
  1.59,
  0.83,
  1.17,
  4.88,
  1.78,
  1.17,
  1.16,
  1.78,
  0.83,
  0.59,
  0.83,
  1.17,
  0.12,
  0.51,
  0.12,
  0.95,
  0.12,
  1.88,
  1.78,
  1.78,
  1.05,
  3.94,
  0.42,
  0.12,
  2.94,
  0.1,
  1.59,
  0.1,
  0.7,
  0.95,
  1.17,
  0.7,
  1.86,
  1.6,
  4.65,
  1.85,
  1.59,
  1.6,
  1.56,
  0.1,
  1.78,
  1.59,
  1.6,
  1.65,
  0.22,
  0.67,
  0.39,
  0.62,
  0.41,
  0.54,
  0.41,
  0.59,
  0.41,
  0.41,
  0.61,
  0.41,
  0.48,
  0.38,
  0.38,
  0.58,
  0.82,
  0.47,
  0.61,
  0.54,
  0.23,
  0.62,
  0.85,
  0.67,
  0.18,
  0.51,
  0.49,
  0.18,
  0.59,
  0.59,
  0.54,
  0.59,
  0.25,
  0.61,
  0.59,
  0.41,
  0.47,
  0.22,
  0.41,
  0.41,
  0.41,
  0.22,
  0.59,
  0.38,
  0.22,
  0.38,
  0.39,
  0.51,
  0.61,
  0.38,
  11.11,
  0.26,
  1.23,
  0.36,
  0.22,
  0.17,
  1.19,
  0.81,
  11.11,
  1.37,
  0.2,
  25,
  0.2,
  1.19,
  0.22,
  0.2,
  0.32,
  15,
  1.37,
  1.37,
  0.19,
  2.7,
  2.7,
  0.71,
  0.91,
  1.37,
  11.11,
  1.44,
  3.08,
  0.33,
  0.33,
  0.35,
  0.35,
  0.33,
  0.33,
  0.33,
  1.05,
  1.15,
  0.92,
  1.5,
  0.72,
  1.7,
  1.2,
  1.05,
  1.05,
  1.63,
  1,
  1.15,
  0.74,
  1.62,
  1.31,
  1.05,
  1.27,
  1.62,
  1.52,
  1.14,
  0.78,
  1.08,
  1.62,
  1.3,
  1.12,
  0.8,
  0.72,
  1.14,
  0.93,
  0.74,
  0.42,
  1.51,
  1.51,
  0.97,
  0.71,
  1.51,
  0.48,
  1.94,
  0.76,
  0.48,
  0.67,
  0.99,
  1.09,
  1.51,
  1.01,
  1.19,
  0.96,
  0.51,
  0.37,
  1.01,
  0.64,
  0.71,
  1.77,
  0.79,
  0.46,
  1.2,
  0.57,
  1.19,
  0.8,
  1.8,
  1.94,
  0.6,
  0.67,
  1.8,
  0.69,
  0.4,
  0.8,
  0.93,
  1.19,
  0.37,
  1.34,
  1.2,
  1.19,
  0.58,
  0.46,
  0.97,
  0.93,
  0.58,
  0.63,
  1.21,
  0.93,
  0.59,
  1.01,
  0.67,
  1.8,
  0.45,
  0.5,
  1.19,
  0.58,
  1.51,
  0.49,
  1.19,
  1.19,
  0.6,
  1.01,
  0.61,
  0.81,
  0.63,
  1.2,
  1.2,
  1.65,
  1.19,
  1.19,
  1.2,
  0.81,
  0.45,
  1.34,
  1.65,
  0.61,
  1.01,
  0.61,
  0.67,
  1.8,
  0.51,
  1.51,
  1.8,
  0.71,
  0.82,
  0.79,
  0.61,
  0.6,
  1.2,
  0.81,
  0.65,
  1.34,
  0.61,
  1.03,
  1.83
]


NaNlargerGroups_median = 0.47
largerGroups= [
  0.83,
  0,
  0,
  1.28,
  0,
  0,
  0,
  1.14,
  0,
  0,
  1.82,
  1.32,
  0,
  1.82,
  0.72,
  0,
  0.83,
  0,
  0,
  0.85,
  1.28,
  1.32,
  0.89,
  0.85,
  1.82,
  0,
  0,
  0,
  0.85,
  1.69,
  0.85,
  0,
  0.82,
  1.28,
  1.32,
  0,
  0.82,
  0,
  1.69,
  0,
  0.85,
  0.73,
  0,
  0.83,
  0.85,
  0,
  0,
  1.43,
  0.73,
  1.34,
  0.57,
  0.82,
  1.52,
  1.28,
  0,
  0.63,
  0,
  0,
  0,
  0.73,
  0.87,
  0,
  1.32,
  0.82,
  0,
  0,
  1.32,
  0,
  0,
  0,
  1.28,
  0.69,
  0.73,
  1.16,
  1.32,
  0.81,
  1.16,
  1.82,
  0.73,
  0.73,
  0.82,
  1.16,
  0.84,
  0.81,
  1.16,
  0,
  1.61,
  0,
  0,
  0.73,
  0,
  0.82,
  0,
  0,
  0.73,
  0.83,
  1.43,
  1.22,
  0.82,
  0.74,
  0,
  0.85,
  0,
  0,
  0,
  0,
  1.82,
  0,
  1.16,
  1.16,
  0,
  0.73,
  1.28,
  0.87,
  1.32,
  0.85,
  0.73,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1.35,
  0,
  0.82,
  0.82,
  0,
  0,
  0.62,
  0.82,
  0,
  0,
  1.28,
  0.85,
  1.82,
  1.32,
  0,
  0.68,
  0,
  0,
  0,
  0,
  0.75,
  0.73,
  1.28,
  0,
  0,
  0,
  0.82,
  0,
  1.22,
  0,
  0,
  0,
  0,
  0,
  0.63,
  0,
  0,
  0.85,
  0.58,
  0,
  0.82,
  0,
  0,
  1.22,
  0,
  0,
  0,
  1.16,
  0,
  1.32,
  0.82,
  0,
  0.82,
  0,
  1.18,
  0.47,
  0.71,
  0.12,
  0.12,
  0.24,
  0.53,
  0.44,
  0.47,
  0.15,
  0,
  0.44,
  0.47,
  0.36,
  0.78,
  0.29,
  0.47,
  0.72,
  0.53,
  0,
  0.53,
  0.53,
  0.47,
  0.63,
  0.53,
  0.47,
  0.47,
  0,
  0.44,
  0.29,
  0.47,
  0.44,
  0.47,
  0.47,
  0.47,
  0.47,
  0.14,
  0.4,
  0.15,
  0.36,
  0.15,
  0.47,
  0.44,
  0.44,
  0.47,
  0.79,
  0.42,
  0.14,
  1.18,
  0.12,
  0.53,
  0.12,
  0.58,
  0.36,
  0.47,
  0.58,
  0.53,
  0.53,
  0.78,
  0.53,
  0.53,
  0.53,
  0.63,
  0.12,
  0.44,
  0.53,
  0.53,
  0.47,
  0.18,
  0.16,
  0.21,
  0.21,
  0.18,
  0.25,
  0.18,
  0.24,
  0.18,
  0.18,
  0.2,
  0.2,
  0.05,
  0.21,
  0.21,
  0.24,
  0.28,
  0.18,
  0.24,
  0.25,
  0.23,
  0.24,
  0.28,
  0.16,
  0.18,
  0.18,
  0.05,
  0.18,
  0.24,
  0.24,
  0.25,
  0.24,
  0.25,
  0.2,
  0.24,
  0.18,
  0.18,
  0.18,
  0.18,
  0.18,
  0.18,
  0.18,
  0.24,
  0.21,
  0.18,
  0.21,
  0.21,
  0.18,
  0.2,
  0.21,
  5.56,
  0.78,
  0.62,
  1.07,
  0.13,
  0.35,
  0.48,
  0.33,
  5.56,
  0.69,
  0.2,
  0,
  0.2,
  0.48,
  0.13,
  0.2,
  0.96,
  5,
  0.69,
  0.69,
  0.19,
  1.8,
  1.8,
  0.35,
  0.18,
  0.69,
  5.56,
  0.58,
  3.08,
  0.05,
  0.06,
  0,
  0,
  0.05,
  0.05,
  0.06,
  0.76,
  0.95,
  0.48,
  0.87,
  0.35,
  0.94,
  0.76,
  0.8,
  0.76,
  0.9,
  0.72,
  0.95,
  0.36,
  0.85,
  1.08,
  0.76,
  0.87,
  0.85,
  0.81,
  0.94,
  0.43,
  0.72,
  0.85,
  1.07,
  0.75,
  0.47,
  0.38,
  0.94,
  0.49,
  0.36,
  0.14,
  1.13,
  1.13,
  0.97,
  1.1,
  1.13,
  0.16,
  0.97,
  0.5,
  0.48,
  0.48,
  0.3,
  0.33,
  1.13,
  1.24,
  0.32,
  0.32,
  0.4,
  0.75,
  1.23,
  0.39,
  0.51,
  0.89,
  0.34,
  0.15,
  0.33,
  0.48,
  0.32,
  0.4,
  1.08,
  0.97,
  0.5,
  0.48,
  1.08,
  0.96,
  0.4,
  0.4,
  0.37,
  0.32,
  0.37,
  0.3,
  0.33,
  0.32,
  0.58,
  0.34,
  0.97,
  0.93,
  0.49,
  0.42,
  0.4,
  0.37,
  0.49,
  1.24,
  0.48,
  1.08,
  0.91,
  0.4,
  0.32,
  0.49,
  1.13,
  0.16,
  0.32,
  0.32,
  0.5,
  1.24,
  0.51,
  0.4,
  0.42,
  0.33,
  0.3,
  0.89,
  0.32,
  0.32,
  0.33,
  0.4,
  0.15,
  0.4,
  0.89,
  0.51,
  1.23,
  0.41,
  0.48,
  1.08,
  0.4,
  1.13,
  1.08,
  0.51,
  0.64,
  0.34,
  0.51,
  0.5,
  0.33,
  0.4,
  1.02,
  0.4,
  0.51,
  1.26,
  0.85
]

all_data = {}
all_data['Type 1'] = singleNodeGroups
all_data['Type 2'] = twoNodeGroups
all_data['Type 3'] = largerGroups

labels, data = all_data.keys(), all_data.values()

fig, ax1 = plt.subplots()
plt.boxplot(data)
ax1.set(ylabel='Percentage of Data Clumps')
plt.xticks(range(1, len(labels) + 1), labels)
plt.subplots_adjust(left=0.12, right=0.95, top=0.98, bottom=0.10)
fig.set_size_inches(6, 4, forward=True)
fig.set_dpi(200)
plt.show()
