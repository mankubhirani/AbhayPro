let bar = new ProgressBar.SemiCircle("#container", {
  strokeWidth: 12,
  color: "white",
  trailColor: "rgba(255,255,255, 0.4)",
  trailWidth: 12,
  easing: "easeInOut",
  duration: 1400,
  svgStyle: null,
  text: {
    value: "",
    alignToBottom: false,
    className: "progressbar__label",
  },

  // Set default step function for all animate calls
  step: (state, bar) => {
    bar.path.setAttribute("stroke", state.color);
    var value = Math.round(bar.value() * 100);
    if (value === 0) {
      bar.setText("");
    } else {
      bar.setText(value);
    }

    bar.text.style.color = state.color;
  },
});
bar.animate(0.2);
