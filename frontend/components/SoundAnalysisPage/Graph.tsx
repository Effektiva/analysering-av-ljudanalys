import { useRef, useEffect, useState, Component } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const STYLE_NAMESPACE = "graph__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
}

const data = [
  {
    name: 0,
    Speech: 3490,
    Yell: 4300,
    Door: 2100,
  },
  {
    name: 10,
    Speech: 4000,
    Yell: 2400,
    Door: 2400,
  },
  {
    name: 20,
    Speech: 3000,
    Yell: 1398,
    Door: 2210,
  },
  {
    name: 30,
    Speech: 2000,
    Yell: 9800,
    Door: 2290,
  },
  {
    name: 40,
    Speech: 2780,
    Yell: 3908,
    Door: 2000,
  },
  {
    name: 50,
    Speech: 1890,
    Yell: 4800,
    Door: 2181,
  },
  {
    name: 60,
    Speech: 2390,
    Yell: 3800,
    Door: 2500,
  },
  {
    name: 70,
    Speech: 3490,
    Yell: 4300,
    Door: 2100,
  },
  {
    name: 80,
    Speech: 4000,
    Yell: 2400,
    Door: 2400,
  },
  {
    name: 90,
    Speech: 3000,
    Yell: 1398,
    Door: 2210,
  },
  {
    name: 100,
    Speech: 2000,
    Yell: 9800,
    Door: 2290,
  },
  {
    name: 110,
    Speech: 2780,
    Yell: 3908,
    Door: 2000,
  },
  {
    name: 120,
    Speech: 1890,
    Yell: 4800,
    Door: 2181,
  },
  {
    name: 130,
    Speech: 2390,
    Yell: 3800,
    Door: 2500,
  },
  {
    name: 140,
    Speech: 3490,
    Yell: 4300,
    Door: 2100,
  },
  {
    name: 150,
    Speech: 4000,
    Yell: 2400,
    Door: 2400,
  },
  {
    name: 160,
    Speech: 3000,
    Yell: 1398,
    Door: 2210,
  },
  {
    name: 170,
    Speech: 2000,
    Yell: 9800,
    Door: 2290,
  },
  {
    name: 180,
    Speech: 3490,
    Yell: 4300,
    Door: 2100,
  },
  {
    name: 190,
    Speech: 4000,
    Yell: 2400,
    Door: 2400,
  },
  {
    name: 200,
    Speech: 3000,
    Yell: 1398,
    Door: 2210,
  },
  {
    name: 210,
    Speech: 2000,
    Yell: 9800,
    Door: 2290,
  },
  {
    name: 220,
    Speech: 2780,
    Yell: 3908,
    Door: 2000,
  },
  {
    name: 230,
    Speech: 1890,
    Yell: 4800,
    Door: 2181,
  },
  {
    name: 240,
    Speech: 2390,
    Yell: 3800,
    Door: 2500,
  },
  {
    name: 250,
    Speech: 3490,
    Yell: 4300,
    Door: 2100,
  },
  {
    name: 260,
    Speech: 4000,
    Yell: 2400,
    Door: 2400,
  },
  {
    name: 270,
    Speech: 3000,
    Yell: 1398,
    Door: 2210,
  },
  {
    name: 280,
    Speech: 2000,
    Yell: 9800,
    Door: 2290,
  },
  {
    name: 290,
    Speech: 2780,
    Yell: 3908,
    Door: 2000,
  },
  {
    name: 300,
    Speech: 1890,
    Yell: 4800,
    Door: 2181,
  },
  {
    name: 310,
    Speech: 2390,
    Yell: 3800,
    Door: 2500,
  },
  {
    name: 320,
    Speech: 3490,
    Yell: 4300,
    Door: 2100,
  },
  {
    name: 330,
    Speech: 4000,
    Yell: 2400,
    Door: 2400,
  },
  {
    name: 340,
    Speech: 3000,
    Yell: 1398,
    Door: 2210,
  },
  {
    name: 350,
    Speech: 3000,
    Yell: 1398,
    Door: 2210,
  }
];

const referenceLinePoints = [60, 120, 180, 240, 300]

const DUMMY_SOUNDFILES_DATA = [
  {
    id: 0,
    startTime: 0,
    endTime: 59
  },
  {
    id: 1,
    startTime: 60,
    endTime: 119
  },
  {
    id: 3,
    startTime: 120,
    endTime: 179
  },
  {
    id: 4,
    startTime: 180,
    endTime: 239
  },
  {
    id: 5,
    startTime: 240,
    endTime: 299
  },
  {
    id: 6,
    startTime: 300,
    endTime: 350
  }
];

type Props = {
  filters: any[]
  mediaPlayerTime: number,
  duration: number,
  clipZoom: boolean
}

const Graph = (props: Props) => {
  const [clipId, setClipId] = useState<number>(-1)
  let filters = props.filters;

  if (props.clipZoom && clipId === -1) {
    let id = DUMMY_SOUNDFILES_DATA.filter(file => {
      return props.mediaPlayerTime >= file.startTime && props.mediaPlayerTime <= file.endTime;
    })[0].id;

    const [file] = DUMMY_SOUNDFILES_DATA.filter(x => {
      return x.id === id;
    });

    filters = filters.filter(x => {
      return x.name >= file.startTime && x.name <= file.endTime;
    });

    filters = filters.map(x => {
      return { ...x, name: x.name - file.startTime };
    });

    setClipId(id);
  } else if (!props.clipZoom) {
    setClipId(-1);
  }


  const secondsToTimeString = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) {
      return "--:--:--";
    }

    // date takes a time in ms
    let str = new Date(seconds * 1000).toISOString().slice(11, 19);
    return str;
  }

  return (
    <div className={Style.Container}>
      {/*Math.round(props.mediaPlayerTime)*/}
      {props.duration}
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" orientation="top" type="number" domain={[0, props.duration]} />
          <YAxis hide="true" />
          <Tooltip />
          {filters.map(elem => {
            return <Area
              key={elem.name}
              type="monotone"
              dataKey={elem.name}
              stackId="1"
              stroke={elem.color}
              fill={elem.color}
            />;
          })}
          {!props.clipZoom && DUMMY_SOUNDFILES_DATA.slice(1).map(file => {
            return <ReferenceLine
              key={file.id}
              x={file.startTime}
              stroke={"black"}
            />;
          })}
          <ReferenceLine x={Math.round(props.mediaPlayerTime)} stroke={"red"} />
        </AreaChart>
      </ResponsiveContainer >
    </div>
  );
}

export default Graph;

