import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';

type MiniBarChartProps = {
  data: number[];
  labels?: string[];
  height?: number;
};

export function MiniBarChart({ data, labels = [], height = 140 }: MiniBarChartProps) {
  const width = 260;
  const barWidth = width / (data.length * 2);
  const maxValue = Math.max(...data, 1);

  return (
    <Svg height={height} width="100%" viewBox={`0 0 ${width} ${height}`}>
      <G>
        {data.map((value, index) => {
          const barHeight = (value / maxValue) * (height - 40);
          const x = index * barWidth * 2 + barWidth / 2;
          const y = height - barHeight - 20;

          return (
            <G key={index}>
              <Rect
                x={x}
                y={y}
                rx={8}
                width={barWidth}
                height={barHeight}
                fill={colors.primary}
                opacity={0.85}
              />
              {labels[index] ? (
                <SvgText
                  x={x + barWidth / 2}
                  y={height - 4}
                  fill={colors.muted}
                  fontSize={10}
                  fontWeight="500"
                  textAnchor="middle"
                >
                  {labels[index]}
                </SvgText>
              ) : null}
            </G>
          );
        })}
      </G>
    </Svg>
  );
}
