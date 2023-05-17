import { useRef, useEffect, useState, Component } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import APIService from '@/models/APIService';
import AppState from '@/state/AppState';
import { LOG as log } from "@/pages/_app";
import SoundInterval, { GraphData } from '@/models/General/SoundInterval';

const STYLE_NAMESPACE = "graph__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Tooltip = STYLE_NAMESPACE + "tooltip",
  TooltipTop = STYLE_NAMESPACE + "tooltipTop",
  TooltipContent = STYLE_NAMESPACE + "tooltipContent",
  TooltipRow = STYLE_NAMESPACE + "tooltipRow",
}

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
  mediaDuration: number,
  clipZoom: boolean,
  soundIntervals: Array<SoundInterval>
}

const Graph = (props: Props) => {
  const [data, setData] = useState<Array<GraphData>>([]);

  // Run when soundIntervals changes.
  useEffect(() => {
    let newData : Array<GraphData> = [];
    props.soundIntervals.forEach(interval => {
      newData.push(interval.asGraphData());
    });
    setData(newData);
  }, [props.soundIntervals]);

  










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

  /* Tooltip for the graph
  Solution got from: https://stackoverflow.com/a/72964329 */
  const GraphTooltip = ({active, payload, label}: any) => {

    if( active && payload && payload.length ) {
      return (
        <div className={Style.Tooltip}>
          <div className={Style.TooltipTop}>
            {secondsToTimeString(label)}
          </div>
          <div className={Style.TooltipContent}>
            {payload.map((pld: any) => (
              <div className={Style.TooltipRow} style={{ backgroundColor: pld.color, color: 'black'}}>
                {pld.dataKey} : {pld.value}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };


  return (
    <div className={Style.Container}>
      {/*Math.round(props.mediaPlayerTime)*/}
      {props.mediaDuration}
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <defs>
            {props.filters.map(elem => {
              return (
                <linearGradient key={elem.name} id={elem.name} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={elem.color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={elem.color} stopOpacity={0}/>
                </linearGradient>
              );
            })}
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tickFormatter={tickItem => secondsToTimeString(tickItem)}
            orientation="top" 
            type="number" 
            domain={[0, props.mediaDuration]} 
          />
          <YAxis hide="true" />
          <Tooltip itemSorter={item => (item.value as number) * -1} />
          {props.filters.map(elem => {
            return <Area
              key={elem.name}
              type="monotone"
              dataKey={elem.name}
              stroke={elem.color}
              strokeWidth={3}
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
          <ReferenceLine x={Math.round(props.mediaPlayerTime / 10) * 10} stroke={"red"} />
          <ReferenceLine y={0.71} stroke={"blue"} label='71%' />
        </AreaChart>
      </ResponsiveContainer >
    </div>
  );
}

export default Graph;

