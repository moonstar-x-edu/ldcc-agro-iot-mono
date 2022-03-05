import React from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HUMIDITY_VALUES } from '../../../constants';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getPointColor = (context) => {
  const value = context.raw;

  if (value < HUMIDITY_VALUES.MIN_SAFE) {
    return 'blue';
  }

  if (value > HUMIDITY_VALUES.MAX_SAFE) {
    return 'red';
  }

  return 'green';
};

const parseMeasures = (measures) => {
  return {
    labels: measures.map((_, idx) => idx + 1),
    datasets: [{
      label: 'Humedad en %',
      data: measures.map((m) => m.humidity * 100),
      fill: false
    }]
  };
};

const HumidityChart = ({ measures, device }) => {
  if (!measures || !device) {
    return null;
  }

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Humedad de ${device.name}`,
        font: {
          size: 18
        }
      },
      legend: {
        display: false
      }
    },
    scales: {
      yAxis: {
        ticks: {
          callback: (t) => `${t}%`
        }
      },
      xAxis: {
        ticks: {
          display: false
        }
      }
    },
    elements: {
      point: {
        backgroundColor: getPointColor,
        borderColor: getPointColor,
        radius: 5,
        hoverRadius: 6
      },
      line: {
        borderColor: 'black'
      }
    }
  };

  const id = `${device.id}-humidity`;

  return (
    <div className="line-chart">
      <Line
        type="line"
        key={id}
        datasetIdKey={id}
        id={id}
        data={parseMeasures(measures)}
        options={options}
        redraw={false}
      />
    </div>
  );
};

HumidityChart.propTypes = {
  measures: PropTypes.arrayOf(PropTypes.shape({
    temperature: PropTypes.number
  })),
  device: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  })
};

HumidityChart.defaultProps = {
  measures: null,
  device: null
};

export default HumidityChart;
