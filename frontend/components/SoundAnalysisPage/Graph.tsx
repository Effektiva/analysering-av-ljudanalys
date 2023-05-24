import { useRef, useEffect, useState, Component } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import AppState from '@/state/AppState';
import { GraphData } from '@/models/General/SoundInterval';

const STYLE_NAMESPACE = "graph__";
enum Style {
  Container = STYLE_NAMESPACE + "container",
  Tooltip = STYLE_NAMESPACE + "tooltip",
  TooltipTop = STYLE_NAMESPACE + "tooltipTop",
  TooltipContent = STYLE_NAMESPACE + "tooltipContent",
  TooltipRow = STYLE_NAMESPACE + "tooltipRow",
}

type Props = {
  filters: any[]
  mediaPlayerTime: number,
  mediaDuration: number,
  clipZoom: boolean,
  appState: AppState
}

/**
 * Helper function to convert seconds to a digital clock convention.
 */
export const secondsToTimeString = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return "--:--:--";
  }

  // date takes a time in ms
  let str = new Date(seconds * 1000).toISOString().slice(11, 19);
  return str;
}

const Graph = (props: Props) => {
  const [data, setData] = useState<Array<GraphData>>([]);
  const [clipBrakes, setClipBrakes] = useState<Array<number>>([]);

  /**
   * Runs when a new clip is selected or the zoom option changes.
   * Here the graph data is fetched tepending on the zoom option and
   * the clip brakes are determined.
   */
  useEffect(() => {
    let newData : Array<GraphData> = [];
    if (props.clipZoom === true) {
      props.appState?.selectedSoundclip?.soundIntervals.forEach(interval => {
        newData.push(interval.asGraphData());
      });
      setClipBrakes([]);
    } else {
      let newClipBrakes : Array<number> = [];
      let duration = 0
      props.appState?.selectedSoundChain?.soundClips.forEach(clip => {
        clip.soundIntervals.forEach(interval => {
          newData.push(interval.asGraphData(duration));
        });
        duration += clip.duration
        newClipBrakes.push(duration);
      });
      setClipBrakes(newClipBrakes.slice(0, -1));
    }
    setData(newData);
  }, [props.appState?.selectedSoundclip, props.clipZoom]);

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
          {clipBrakes.map(brake => {
            return <ReferenceLine key={brake} x={brake} stroke={"black"} />
          })}
          <ReferenceLine x={props.mediaPlayerTime} stroke={"red"} />
          <ReferenceLine y={0.71} stroke={"blue"} label='71%' />
        </AreaChart>
      </ResponsiveContainer >
    </div>
  );
}

export default Graph;

