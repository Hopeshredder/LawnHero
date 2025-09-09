import { Bird, Skull, Cascade } from "../animations/lottie";

export default function Dallas() {
  return (
    <div className="w-screen h-screen overflow-hidden relative bg-black">
      <div className="absolute inset-0">
        <Cascade />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <Bird />
      </div>

      <div className="absolute bottom-4 left-4 w-24 h-24">
        <Skull />
      </div>
    </div>
  );
}
