document.addEventListener("DOMContentLoaded", function () {
  const morphButton = document.getElementById("morph-button");
  const pathElement = document.getElementById("morph-path");

  const path1 = pathElement.getAttribute('d');
  const path2 = "M88 12L88 88L12 88L12 12L88 12Z";

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function parsePath(path) {
    return path.match(/[-+]?[0-9]*\.?[0-9]+/g).map(Number);
  }

  function generatePathString(commands, values) {
    let valueIndex = 0;
    return commands.reduce((pathString, command) => {
      let commandValues = values.slice(valueIndex, valueIndex + command.length);
      valueIndex += command.length;
      return pathString + command.cmd + commandValues.join(" ");
    }, "");
  }

  function morphPaths(path1, path2, t) {
    const commands = path1.match(/[a-zA-Z][^a-zA-Z]*/g).map((command) => {
      const numbers = command.slice(1).match(/[-+]?[0-9]*\.?[0-9]+/g) || [];
      return { cmd: command[0], length: numbers.length };
    });

    const values1 = parsePath(path1);
    const values2 = parsePath(path2);

    const morphedValues = values1.map((val, i) => lerp(val, values2[i], t));

    return generatePathString(commands, morphedValues);
  }

  morphButton.addEventListener("click", () => {
    let t = 0;
    function animate() {
      t += 0.05;
      if (t > 1) t = 1;
      const morphedPath = morphPaths(path1, path2, t);
      pathElement.setAttribute("d", morphedPath);
      if (t < 1) requestAnimationFrame(animate);
    }
    animate();
  });
});
