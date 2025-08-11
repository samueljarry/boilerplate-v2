type BoxSpacing = {
  x: number;
  y: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export const getStyleInPixel = (str: string) => parseInt(str.split("px")[0]);

const parseBoxSpacing = (spacing: string) => {
  const spacingStyle = spacing.trim().split(/\s+/);
  let values: BoxSpacing = {
    x: 0,
    y: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };

  switch (spacingStyle.length) {
    case 1: {
      const v = getStyleInPixel(spacingStyle[0]);
      values = {
        x: v * 2,
        y: v * 2,
        top: v,
        right: v,
        bottom: v,
        left: v,
      };
      break;
    }
    case 2: {
      const y = getStyleInPixel(spacingStyle[0]);
      const x = getStyleInPixel(spacingStyle[1]);
      values = {
        x: x * 2,
        y: y * 2,
        top: y,
        right: x,
        bottom: y,
        left: x,
      };
      break;
    }
    case 3: {
      const t = getStyleInPixel(spacingStyle[0]);
      const x = getStyleInPixel(spacingStyle[1]);
      const b = getStyleInPixel(spacingStyle[2]);
      values = {
        x: x * 2,
        y: t + b,
        top: t,
        right: x,
        bottom: b,
        left: x,
      };
      break;
    }
    case 4: {
      const t = getStyleInPixel(spacingStyle[0]);
      const r = getStyleInPixel(spacingStyle[1]);
      const b = getStyleInPixel(spacingStyle[2]);
      const l = getStyleInPixel(spacingStyle[3]);
      values = {
        x: r + l,
        y: t + b,
        top: t,
        right: r,
        bottom: b,
        left: l,
      };
      break;
    }
  }

  return values;
}

export const getSpacings = (element: HTMLElement) => {
  const rect = JSON.parse(JSON.stringify(element.getBoundingClientRect()));

  const styles = window.getComputedStyle(element);
  const gap = getStyleInPixel(styles.gap);

  // paddings
  const padding = parseBoxSpacing(styles.padding);
  const margin = parseBoxSpacing(styles.margin);

  return {
    ...rect,
    gap,
    padding,
    margin,
  }
};