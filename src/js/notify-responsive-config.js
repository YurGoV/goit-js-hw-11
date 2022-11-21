export const notifyParams = {
  width: NaN,
  position: NaN,
  distance: NaN,
  opacity: NaN,
  clickToClose: NaN,
  fontSize: NaN,

  setParams() {
    if (window.innerWidth >= 1100) {
        return {
        position: 'right-top',
        fontSize: '18px',
        width: '400px',
        distance: '10px',
        opacity: 0.7,
        clickToClose: true,
        }
      }
      if (window.innerWidth <= 810) {
        return {
        position: 'left-top',
        fontSize: '12px',
        width: '200px',
        distance: '10px',
        opacity: 0.7,
        clickToClose: true,
        }
      }
    return {
    position: 'right-top',
    fontSize: '14px',
    width: '280px',
    distance: '10px',
    opacity: 0.7,
    clickToClose: true,
    }
  },
};

// usage example:
// const nofifyConfig = notifyParams.setParams();
// Notify.init(nofifyConfig);
