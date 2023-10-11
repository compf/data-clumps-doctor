import matplotlib.pyplot as plt
import numpy as np

# Data
projects = ['ArgoUML', 'Caffeine', 'Dolphin \n Scheduler', 'JFlex', 'JFreeChart', 'RocketMQ', 'Xerces2 \n  Java']  # Corrected names
amount_data_clumps_keys = [201  , 122   , 2424,  132,   133,   1019,   684]
percentage_type_a = [      0    , 2.46  , 0.41, 0.76, 67.67 ,   6.58, 0.15]
percentage_type_b = [      9.95 , 41.8  , 40.59, 47.73, 21.8, 57.21 , 27.34]
percentage_type_c = [   63.18   , 13.11 , 12.25, 3.97, 10.53, 6.13  , 10.38]
percentage_type_d = [   20.4    , 42.62 , 46.66, 46.21, 0   , 26.69  , 61.99]
percentage_type_e = [   6.47    , 0     , 0     , 1.52, 0  , 0.39  , 0.15]

x = np.arange(len(projects))  # the label locations
width = 0.15  # the width of the bars, adjusted to fit the new Type E

fig, ax = plt.subplots()
rects1 = ax.bar(x - 2*width, percentage_type_a, width, label='Category A')
rects2 = ax.bar(x - width, percentage_type_b, width, label='Category B')
rects3 = ax.bar(x, percentage_type_c, width, label='Category C')
rects4 = ax.bar(x + width, percentage_type_d, width, label='Category D')
rects4 = ax.bar(x + 2*width, percentage_type_e, width, label='Category E')

# Add some text for labels, title and custom x-axis tick labels, etc.
ax.set_xlabel('Projects')
ax.set_ylabel('Percentage')
ax.set_xticks(x)
ax.set_xticklabels(projects)

# Move legend below the diagram
ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.35), fancybox=True, shadow=True, ncol=5)

fig.tight_layout()
plt.subplots_adjust(left=0.12, right=0.93, top=0.90, bottom=0.30)
fig.set_size_inches(6, 5, forward=True)
plt.xticks(rotation=45)
plt.show()
