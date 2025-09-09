import Lottie from "lottie-react";

import bird from "../assets/Birds.json";
import skull from "../assets/Skull.json";
import cascading from "../assets/Cascading.json";

function Bird() {
  return <Lottie animationData={bird} loop={true} />;
}

function Skull() {
  return <Lottie animationData={skull} loop={true} />;
}

function Cascade() {
  return <Lottie animationData={cascading} loop={true} />;
}

export { Bird, Skull, Cascade };
