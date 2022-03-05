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
import { TEMPERATURE_VALUES } from '../../../constants';

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

  if (value < TEMPERATURE_VALUES.MIN_SAFE) {
    return 'blue';
  }

  if (value > TEMPERATURE_VALUES.MAX_SAFE) {
    return 'red';
  }

  return 'green';
};

const parseMeasures = (measures) => {
  return {
    labels: measures.map((_, idx) => idx + 1),
    datasets: [{
      label: 'Temperatura en ºC',
      data: measures.map((m) => m.temperature),
      fill: false
    }]
  };
};

const TemperatureChart = ({ measures, device }) => {
  if (!measures || !device) {
    return null;
  }

  const options = {
    maintainAspectRatio: true,
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: `Temperatura de ${device.name}`,
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
          callback: (t) => `${t}ºC`
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

  return (
    <div className="line-chart">
      <Line
        type="line"
        key={device.id}
        datasetIdKey={device.id}
        id={device.id}
        data={parseMeasures(measures)}
        options={options}
        redraw
      />
    </div>
  );
};

TemperatureChart.propTypes = {
  measures: PropTypes.arrayOf(PropTypes.shape({
    temperature: PropTypes.number
  })),
  device: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.string
  })
};

TemperatureChart.defaultProps = {
  measures: null,
  device: null
};

export default TemperatureChart;
