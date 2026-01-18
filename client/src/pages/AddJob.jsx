import { useState } from "react";

function AddForm() {
  const [formData, setFormData] = useState({
    position: "",
    company: "",
    location: "",
    status: "",
    appliedDate: "",
    link: "",
    note: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault(); // ❗ prevent page refresh
    console.log("Form submitted:", formData);
  }

  return (
    <>
    <div className="flex items-center justify-center">
    <h3 className="font-semibold text-white">Add a new Job</h3>
    </div>
    <form className="flex items-center justify-center mt-10" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2 w-3/4 md:w-1/2 md:space-y-4">
      <input
        className="border border-gray-300 rounded px-4 py-2 text-white"
        type="text"
        name="position"
        placeholder="Enter Position"
        value={formData.position}
        onChange={handleChange}
      />

      <input
        className="border border-gray-300 rounded px-4 py-2 text-white"
        type="text"
        name="company"
        placeholder="Enter Company"
        value={formData.company}
        onChange={handleChange}
      />

      <input
        className="border border-gray-300 rounded px-4 py-2 text-white"
        type="text"
        name="location"
        placeholder="Enter Location"
        value={formData.location}
        onChange={handleChange}
      />
    <select className="border border-gray-300 rounded px-4 py-2 text-white cursor-pointer [color-scheme:dark]" value={formData.status} onChange={handleChange}>
      <option className="border border-gray-300 rounded px-4 py-2 text-black cursor-pointer" value="">Select a Status</option>
      <option className="border border-gray-300 rounded px-4 py-2 text-black cursor-pointer" value="applied">Appied</option>
      <option className="border border-gray-300 rounded px-4 py-2 text-black cursor-pointer" value="interviewing">Interviewing</option>
      <option className="border border-gray-300 rounded px-4 py-2 text-black cursor-pointer" value="rejected">Rejected</option>
      <option className="border border-gray-300 rounded px-4 py-2 text-black cursor-pointer" value="selected">Selected</option>
      <option className="border border-gray-300 rounded px-4 py-2 text-black cursor-pointer" value="noresponse">No Response</option>
      <option className="border border-gray-300 rounded px-4 py-2 text-black cursor-pointer" value="declined">Declined</option>
    </select>
    <input
        className="border border-gray-300 rounded px-4 py-2 text-white [color-scheme:dark] cursor-pointer"
        type="date"
        name="appliedDate"
        placeholder="Enter Applied Date"
        value={formData.appliedDate}
        onChange={handleChange}
      />
      <input
        className="border border-gray-300 rounded px-4 py-2 text-white"
        type="text"
        name="link"
        placeholder="Enter Posting Link"
        value={formData.link}
        onChange={handleChange}
      />
      <input
        className="border border-gray-300 rounded px-4 py-2 text-white"
        type="text"
        name="note"
        placeholder="Enter Note"
        value={formData.note}
        onChange={handleChange}
      />
      <button type="submit" className="border border-gray-300 rounded px-4 py-2 bg-green-500 text-white cursor-pointer">Submit</button>
      </div>
    </form>
    </>
  );
}

export default AddForm;
