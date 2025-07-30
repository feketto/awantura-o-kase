const rewards = [
  ["chełmon", "#FF0000"],
  ["biologia", "#0000FF"],
  ["co to jest", "#00CC00"],
  ["sport", "#9a07b5"],
  ["geografia", "#0a4f1a"],
  ["kulinaria", "#EE82EE"],
  ["wędkarstwo", "#FF0000"], 
  ["WoS", "#0FBDE0"],
  ["ciekawostki", "#FFDD00"],
  ["chełmon", "#FFA500"], 
  ["filozofia", "#00CC00"],
  ["muzyka", "#0000FF"],
  ["fizyka", "#EE82EE"],
  ["skrzynka", "#222222"],
  ["polski", "#0a4f1a"],
  ["wiedza ogólna", "#0FBDE0"],
  ["chemia", "#9a07b5"],
  ["matematyka", "#FFA500"]
];

const w = document.getElementById("w"),
c = document.getElementById("c");

const segmentMaxWidth = Math.ceil(400 * Math.PI / rewards.length),
  segmentHalfWidth = 1 * segmentMaxWidth,
  segmentRotate = 360 / rewards.length;

for (let i = 0, j = 0; i < rewards.length; i++) {
	j = rewards.length - 1 - i; 
	const segment = document.createElement("div");
	segment.classList.add("segment");
	segment.style.left = '-82px';
	segment.style.borderColor = `transparent transparent ${rewards[i][1]} transparent`;
	segment.style.borderWidth = `0 ${segmentHalfWidth}px 420px ${segmentHalfWidth}px`; // overshoot 2px for arc
	segment.style.transform = `rotateZ(${180 + j * segmentRotate}deg)`;


  const txt = document.createElement("div");
  txt.classList.add("txt");
  const reward = rewards[i][0].toString();
  const str = ["x2", ":2", "*"].includes(reward) ?
    reward :
    reward.split("").join("<br>");
  txt.innerHTML = str;
  txt.style.width = `${segmentMaxWidth}px`;
  segment.appendChild(txt);

  c.appendChild(segment);
}



function turn(deg = null) {
  const currentRotation = getRotationAngle(w),
    minimumRotation = 600, // Minimum rotation in degrees
    baseRotation = Math.round(Math.random() * 720); // Random additional rotation

  // Set the number of full rotations
  const fullRotations = 3; // Change this value to adjust the spin length

  const newRotation = minimumRotation + baseRotation + (fullRotations * 360);

  // Set the rotation time (adjust as needed for desired speed)
  const time = 10000; // Change this value to adjust the speed

  w.style.transition = `transform ${time}ms cubic-bezier(0.42, -0.1, 0.58, 1.02)`;
  w.style.transform = `rotate(${newRotation}deg)`;

  // Post-turn logic
  setTimeout(() => {
    const rot = newRotation % 360;
    w.style.transition = "none";
    w.style.transform = `rotate(${rot}deg)`;

    const segmentIndex =
      rot < 0.5 * segmentRotate ?
      rewards.length - 1 :
      Math.floor((rot - 0.5 * segmentRotate) / segmentRotate);
  }, time + 100);
}

// Get the angle of rotation from an element
function getRotationAngle(element) {
  const computedStyle = window.getComputedStyle(element);
  const transform =
    computedStyle.transform ||
    computedStyle.webkitTransform ||
    computedStyle.mozTransform;

  if (transform === "none") {
    return 0;
  }

  const values = transform.split("(")[1].split(")")[0].split(",");
  const a = parseFloat(values[0]);
  const b = parseFloat(values[1]);
  return Math.round(Math.atan2(b, a) * (180 / Math.PI));
}

// Click event listener
w.addEventListener("click", () => {
  turn();
});
