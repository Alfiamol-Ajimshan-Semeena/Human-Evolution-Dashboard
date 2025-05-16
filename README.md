# Human Evolution Data Visualization Dashboard

## Overview
This interactive dashboard visualizes the evolution of human ancestors using various data visualization techniques. The project provides insights into physical characteristics, technological advancements, and geographical distribution of different human species over time.

## Dataset:
- **Source**: [Kaggle - Biological Data of Human Ancestors](https://www.kaggle.com/datasets/santiago123678/biological-data-of-human-ancestors-data-sets)
- **License**: [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0.txt)
- **File**: `Evolution_DataSets.csv`
- **Key Fields**:
  - `Genus_&_Specie`: Species classification
  - `Time`: Age in millions of years
  - `Current_Country`: Geographic location
  - `Location`: continent location where each hominid species lived
  - `Zone`:  either east, west, south or north of the continent
  - `Cranial_Capacity`: Brain size in cc
  - `Height`: Body height in cm
  - `Techno_type`: Tool usage classification
  - `Habitat`: Environmental context
  - `Jaw_Shape`: Dental morphology
  - `Diet`: Feeding habits
  - `Habitat`: Environmental context
  - `Incisor_Size`: size of the incisor in each hominid species
  - `Canine size`: size of the canines in each hominid species
 
    ## Project Structure

### Core Files
```
├── index.html              # Main HTML file containing the dashboard layout
├── styles/
│   ├── images              # images for animation
│   ├── main.css           # Global styles and chart-specific CSS
│   ├──scripts/
│   ├── main.js            # Core application logic and data handling
│   ├── BarChart.js          # Bar chart for species frequency over zones
│   ├── Bubblechart.js         # Bubble chart for species jawshape and incisor size
│   ├── ButterflyChart.js   # Butterfly chart for habitat
│   ├── GeographicalMap.js  # Geographical chart for species distribution over countries
│   ├── lineChart.js       # Line chart for dental metrics
│   ├── piechart.js        # Pie chart for geographic distribution
│   ├── stackedbar.js       # Stackedbar for technology type used over time
│   ├── timeline.js        # Timeline for species evolution
|   ├── treelayout.js     # Family tree for human evolution
│   └── Treemap.js    # Treemap for habitat distribution 
├──Evolution_DataSets.csv  # Main dataset file 
├──Exploratory_Data Analysis 
|              
└──README.md

### Component Dependencies

1. **main.js**
   - **Primary Functions**:
     - `updateCharts()`: Synchronizes all visualizations
     - `filterData()`: Applies  filtering for all charts
     - `generateSummaryInsights()`: Creates  insights
   - **Dependencies**: D3.js (v7+)
   - **Event Handling**: Manages dropdown and slider for interactions
  

2. **Chart Components**:

    a. **Treelayout.js**
   - Purpose: Show species ancestors family tree
   - Features:
     - Shows how Homo sapiens evolved from earlier hominins 
     - Species appearance/extinction

    b. **Timeline.js**
   - Purpose: Show species evolution over time
   - Features:
     - Interactive timeline navigation
     - Species appearance/extinction 
     
   c. **PieChart.js**
   - Purpose: Show geographic distribution of species across location
   - Features:
     - Specifies continents
     - Percentage labels
 

   d. **BarChart.js**
   - Purpose: Visualize species frequency by geographic zone
   - Key Features:
     - Interactive tooltips with species counts
     - Value labels on bars and hovering
     - Color-coded bars for easy comparison
     - Responsive design with automatic scaling and animation

    e. **GeographicalMap.js**
   - Purpose: Visualizes different geographic regions of species
   - Key Features:
     - Interactive tooltips with species counts and countries 
     - Value labels on regions while hovering
   
    f. **TreeMap.js**
   - Purpose: Visualize habitat distribution
   - Features:
     - Hierarchical habitat organization
     - Size-based representation
     - Interactive zooming
     - Color-coded ecosystem types
      
   g. **ButterflyChart.js**
   - Purpose: Compare height and cranial capacity
   - Features:
     - Height vs. cranial capacity correlation
     - Interactive selection (hovering)


   h. **StackedbarChart.js**
   - Purpose: Visualize technology type and time period
   - Key Features:
     - Interactive labels on bars with species and time period
     - Color-coded bars for easy comparison

   i. **StackedbarChart.js**
   - Purpose: Visualize technology type and time period
   - Key Features:
     - Interactive labels on bars with species and time period
     - Color-coded bars for easy comparison
     
   j. **LineChart.js**
   - Purpose: Track dental metrics over time
   - Features:
     - Dual-line display (incisor and canine size)
     - Interactive time points with hovering
     - Trend line visualization
     - Animated lines showing change in dental size 



   

### Features and Functionality

1. **Data Filtering System**
   - **Species Selection**:
     - Dropdown with all species names
     - Multi-select capability
     - Auto-complete search
     - "All" options
   
   - **Region Filtering**:
     - Geographic region selection
     - Country mapping

   
   - **Time Period Selection**:
     - Interactive slider
     - Predefined period shortcuts
     - Custom range input
     - Major event markers

2. **Interactive Visualizations**
   - **Bar Chart**: 
     - Shows species frequency by zone
     - Highlights regional biodiversity
   
   - **Pie Chart**: 
     - Displays geographic distribution 
     - Shows percentage breakdowns
   
   - **Timeline**: 
     - Maps species evolution
     - Shows technological advances
     - Indicates environmental changes
     - Supports zoom and pan
   
   - **Stacked Bar Chart**: 
     - Shows technology progression
     - Color-coded by tool type
     - Time-based stacking
     - Interactive layer selection

3. **Summary Insights Panel**
   - Real-time statistical updates
   - Key metric highlights
   - Trend identification
   - Comparative analysis
   
4. **Cross-Chart Interactions**
   - Synchronized highlighting
   - Linked filtering
   - Coordinated updates
   - Consistent color scheme
   - Bidirectional charts

### Data Processing Pipeline
1. **Data Loading**: CSV parsing with D3.js
2. **Type Conversion**: Numeric and categorical data handling
3. **Data Validation**: Error checking and cleanup
4. **Filtering Logic**: Multi-criteria filtering system
5. **Update Mechanism**: Real-time visualization updates

## Setup and Running
1. Clone the repository
2. Ensure you have Python installed (for local server)
3. Run live browser in the project directory


## Technical Stack
- **D3.js**: Version 7+ for data visualization
- **HTML5/CSS3**: Modern web standards
- **JavaScript (ES6+)**: Core application logic
- **Python**: For Exploratory Data Analysis 

## Maintenance Notes
- Chart components are modular and can be extended
- Data processing is centralized in main.js
- Styles are organized by component in main.css
- Browser compatibility: Modern browsers (Chrome, Firefox, Safari, Edge)

## Future Improvements
- Add more interactive features
- Implement data caching
- Add more visualization types
- Enhance mobile responsiveness
- Add unit tests
