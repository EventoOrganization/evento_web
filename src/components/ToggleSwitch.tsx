// Components/ToggleSwitch.jsx

const ToggleSwitch = ({ isToggled, onToggle }: any) => {
  return (
    <div className="relative inline-block w-14 mr-2 align-middle select-none transition duration-200 ease-in">
      <input
        type="checkbox"
        name="toggle"
        id="toggle"
        checked={isToggled}
        onChange={onToggle}
        className={`${isToggled ? "translate-x-6 " : "translate-x-0"} absolute block w-8 h-8 rounded-full bg-white border-4 appearance-none cursor-pointer top-1/2 -translate-y-1/2 transition-transform duration-200`}
      />
      <label
        htmlFor="toggle"
        className={`toggle-label block overflow-hidden h-8 rounded-full  cursor-pointer w-full transition-colors duration-200 ease-in-out ${isToggled ? "bg-blue-300" : "bg-gray-300"}`}
      ></label>
    </div>
  );
};

export default ToggleSwitch;
