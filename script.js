document.addEventListener("DOMContentLoaded", function () {
  const morphButton = document.getElementById("morph-button");
  const pathElement = document.getElementById("morph-path");

  const path1 = pathElement.getAttribute('d');
  const path2 = "M121.5 36.5C116.979 38.4919 115.548 39.4118 110.5 39C92.3209 37.5169 75.6111 25 57 25C21.7544 25 12.5 26.5 12.5 50.5C12.5 73.4412 19.5 82 42.5 82C65.5 82 70.4047 78.5732 84 64C88.6228 59.0447 88.1579 57.2055 95.5 60.5C104.486 64.5322 111 89 121.5 89C134.862 89 165.662 93.4844 176.5 87C190.613 78.5566 196 53.4619 196 39C196 18.8575 175.523 2.77437 154.5 3.5C140.799 3.9729 133.275 31.3123 121.5 36.5Z"z;

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
