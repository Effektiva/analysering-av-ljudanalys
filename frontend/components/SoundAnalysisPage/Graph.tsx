import { useRef, useEffect, useState, Component } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import APIService from '@/models/APIService';
import { data } from './DUMMY'; //remove later

const STYLE_NAMESPACE = "graph__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
}

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
  // const [clipId, setClipId] = useState<number>(-1)
  // let filters = props.filters;

  // if (props.clipZoom && clipId === -1) {
  //   let id = DUMMY_SOUNDFILES_DATA.filter(file => {
  //     return props.mediaPlayerTime >= file.startTime && props.mediaPlayerTime <= file.endTime;
  //   })[0].id;

  //   const [file] = DUMMY_SOUNDFILES_DATA.filter(x => {
  //     return x.id === id;
  //   });

  //   filters = filters.filter(x => {
  //     return x.name >= file.startTime && x.name <= file.endTime;
  //   });

  //   filters = filters.map(x => {
  //     return { ...x, name: x.name - file.startTime };
  //   });

  //   setClipId(id);
  // } else if (!props.clipZoom) {
  //   setClipId(-1);
  // }


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
          {props.filters.map(elem => {
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

