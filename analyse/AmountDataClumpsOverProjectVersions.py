import matplotlib.pyplot as plt
import pandas as pd
import matplotlib
matplotlib.rcParams.update({'font.size': 18})

# List of markers to cycle through
markers = ['o', 'x', 'D', '+', '*', 's', 'p', 'h', 'v', '^', '<', '>']
projects = {
    'ArgoUML' : [
142,142,98,80,88,130,110,80,110,142,110,80,118,80,118,110,224,198,78,160,80,132,78,90,106,80,144,86,86,110,86,86,80,124,80,80,130,84,82,136,80,110,80,86,86,112,142,80,80,80,130,98,142,142,222,106,80,162,110,148,80,80,80,134,80,142,82,74,80,80,160,142,80,80,82,142,110,110,86,80,106,84,72,118,120,120,120,120,120,120,120,120,122,174,172,182,184,184,182,182,182,182,182,182,182,182,182,182,182,70,182,182,182,70,78,78,78,78,78,78,78,78,76,76,76,76,76,76,76,76,76,70,70,112,120,122,122,122,122,122,122,122,122,122,122,122,122,120,120,122,122,120,115,115,117,117,117,117,117,117,117,117,117,119,117,123,123,137,137,137,137,137,137,137,137,137,137,137,139],
    'Caffeine' : [
123,127,129,129,123,137,139,141,170,170,320,320,378,378,378,378,378,374,374,374,374,376,378,378,378,424,424,426,450,450,450,450,450,450,450,684,686,838,838,844,844,848,848,848,848,854,856,856,860,860,862,854,844,844,854,988,854,948,3382,3382,3384,4136,4146,4146,4146,4146,4150,4150],
    'Dolphin Scheduler' : [
1621,1769,2224,2240,2246,2246,2276,2280,1820,1857,1934,1932,1943,1971,1971,1971,2023,2023,2023,3160,3162,3708,3764,3789,3732,3732,4948,4943,5085,5089,3741,5140,5177,6141,3741,6153,5214,5214,6083,5224,6119,3750,6119,5224,6119,6119,6119,5224,3750,6131],
    'JFlex' : [
12,20,18,18,18,111,111,65,291,291,291,291,324,347,281,314,421,386,421,615,578,550,513,564,501,2243,501,501,2243],
    'JFreeChart' : [
2015,2015,1818,1818,1830,1830,1830],
    'RocketMQ' : [
986,1061,1106,1175,1175,1175,1267,1296,1304,1478,1480,1490,1492,1494,1588,1601,2045,1623,1660,2129,1806,2939,3976,1718,4434,1718,1718,4432,4448,4565],
    'Xerces2 Java' : [
440,536,819,753,779,998,988,988,987,987,947,947,977,987,988,397,988,988,861,995,995,656,995,660,1015,1029,716,1029,1051,1047,1051,1047,620,1045,664,670,612,874,886,1043,1099,886,1007,742,746,746,742,742,742,936,748,748,914,920,920,920,920,920,926,926,926,926,516,926,926,926,516,926,531,531,531,531,531,531,557,557,557,557,926,557,1070,1070,787,787,789,820,870,887,887,887,891,894,1132,1270,1132,1377,1182,1451]
}
# Find the maximum length among all projects
max_length = max(len(data) for data in projects.values())
# Normalize the timestamps for each project and create a DataFrame
data = {'Timestamps': range(1, max_length + 1)}
for project_name, project_data in projects.items():
    normalized_timestamps = [i/(len(project_data)-1) for i in range(len(project_data))]
    data[f'Normalized Timestamps {project_name}'] = normalized_timestamps + [None] * (max_length - len(project_data))
    data[project_name] = project_data + [None] * (max_length - len(project_data))

df = pd.DataFrame(data)

# Plotting
plt.figure(figsize=(10, 6))
for i, project_name in enumerate(projects.keys()):
    marker = markers[i % len(markers)]  # Cycle through the list of markers
    plt.plot(df[f'Normalized Timestamps {project_name}'], df[project_name], marker=marker, linestyle='-', label=project_name)

#plt.title('Project Data Clumps Over Project Versions')
plt.xlabel('Project Versions')
plt.ylabel('Amount Data Clumps')
plt.subplots_adjust(left=0.12, right=0.98, top=0.97, bottom=0.06)
plt.legend()
plt.grid(True)

# Remove the x-axis tick labels
plt.xticks([], [])

plt.show()
