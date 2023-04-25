import { useRef, useEffect, useState } from 'react';

const STYLE_NAMESPACE = "graph__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
}

const data = {
  categories: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  series: [
    {
      name: 'Seoul',
      data: [20, 40, 25, 50, 15, 45, 33, 34, 20, 30, 22, 13],
    },
    {
      name: 'Sydney',
      data: [5, 30, 21, 18, 59, 50, 28, 33, 7, 20, 10, 30],
    },
    {
      name: 'Moscow',
      data: [30, 5, 18, 21, 33, 41, 29, 15, 30, 10, 33, 5],
    },
  ],
};
const options = {
  chart: { title: 'Average Temperature', width: 900, height: 400 },
  xAxis: { pointOnColumn: false, title: { text: 'Month' } },
  yAxis: { title: 'Temperature (Celsius)' },
};

const Graph = () => {
  const [areaChart, setAreaChart] = useState<any>();

  useEffect(() => {
    const initAreaChart = async () => {
        const { AreaChart } = await import('@toast-ui/react-chart');
        setAreaChart(<AreaChart data={data} options={options} />);
    }
    initAreaChart()
  }, [])

  return (
    <div className={Style.Container}>
      {areaChart}
    </div>
  );
}

export default Graph;

