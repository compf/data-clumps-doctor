import matplotlib.pyplot as plt
import numpy as np

# Data
projects = [                'ArgoUML'   , 'Caffeine'    , 'Dolphin \n Scheduler'    , 'JFlex'   , 'JFreeChart'  , 'RocketMQ'    , 'Xerces2 \n  Java']  # Corrected names
amount_data_clumps_keys = [ 1310        , 5211          , 14936                     , 3894      , 3845          , 7227          , 5340]
percentage_type_a = [       0,           0.15           , 0                         , 0         , 0             , 4.21          , 0]
percentage_type_b = [       10.61,      79.49           , 41.05                     , 57.6      , 47.59         , 58.96         , 27.17]
percentage_type_c = [       49.24,      2.21            , 10.85                     , 0.31      , 52.41         , 9.44          , 8.24]
percentage_type_d = [       40.15,      18.15           , 48.1                      , 42.09     , 0             , 27.4          , 64.59]

x = np.arange(len(projects))  # the label locations
width = 0.15  # the width of the bars, adjusted to fit the new Type E

fig, ax = plt.subplots()
rects1 = ax.bar(x - 2*width, percentage_type_a, width, label='Category A')
rects2 = ax.bar(x - width, percentage_type_b, width, label='Category B')
rects3 = ax.bar(x, percentage_type_c, width, label='Category C')
rects4 = ax.bar(x + width, percentage_type_d, width, label='Category D')

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
