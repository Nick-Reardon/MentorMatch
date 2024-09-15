import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { runForceGraph } from './ForceGraphGenerator.js';
import styles from './forceGraph.module.css';

export function ForceGraph({
  skillsData,
  linksData,
  nodesData,
  nodeHoverTooltip,
  getNodeInfo,
  setActiveStyle,
  activeStyle,
}) {
  const containerRef = React.useRef(null);

  useEffect(() => {
    let destroyFn;

    d3.select('svg').remove();

    if (containerRef.current) {
      const { destroy } = runForceGraph(
        containerRef.current,
        linksData,
        nodesData,
        skillsData,
        nodeHoverTooltip,
        getNodeInfo,
        setActiveStyle,
        activeStyle
      );
      destroyFn = destroy;
    }

    return destroyFn;
  }, [linksData, nodesData]);

  return <div ref={containerRef} className={styles.container} />;
}
