import mtgLogo from "./MTG.webp";
import plusIcon from "./plus.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { db } from "./api/firebase";
import { ref, onValue, off, push } from "firebase/database";

interface Term {
  name: string;
  description: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [newTermName, setNewTermName] = useState("");
  const [newTermDescription, setNewTermDescription] = useState("");
  const [isInputFieldsOpen, setInputFieldsOpen] = useState(false);
  const [firebaseData, setFirebaseData] = useState<Term[]>([]);
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const filteredData = firebaseData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputFieldsToggle = () => {
    setInputFieldsOpen(!isInputFieldsOpen);
    setNewTermName("");
    setNewTermDescription("");
    // Reset error messages when the input fields are toggled
    setNameError("");
    setDescriptionError("");
  };

  const validateInputs = () => {
    let isValid = true;

    // Reset error messages
    setNameError("");
    setDescriptionError("");

    if (!newTermName) {
      setNameError("Naam is verplicht");
      isValid = false;
    }

    if (!newTermDescription) {
      setDescriptionError("Uitleg is verplicht");
      isValid = false;
    }

    return isValid;
  };

  const handleAddTerm = () => {
    const isValid = validateInputs();

    if (isValid) {
      const dbRef = ref(db);
      const newData = {
        name: newTermName,
        description: newTermDescription,
      };
      push(dbRef, newData)
        .then(() => {
          console.log("Data pushed successfully");
          // Close the input fields after successful submission
          handleInputFieldsToggle();
        })
        .catch((error) => {
          console.error("Error pushing data:", error);
        });
    }
  };

  useEffect(() => {
    const dbRef = ref(db);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray: Term[] = Object.values(data);
        dataArray.sort((a, b) => a.name.localeCompare(b.name));
        setFirebaseData(dataArray);
      }
    });
    return () => {
      off(dbRef);
    };
  }, []);


  return (
    <>
      {" "}
      <div className={`overlay ${isInputFieldsOpen ? "active" : ""}`}></div>
      <div className="nav">
        <img src={mtgLogo} className="logo" alt="Vite logo" />
        <div className="group">
          <button className="term-button" onClick={handleInputFieldsToggle}>
            <img
              src={plusIcon}
              className={`plus-icon ${isInputFieldsOpen ? "open" : ""}`}
              alt="Plus icon"
            />
          </button>
          {isInputFieldsOpen && (
            <div className="inputFields">
              <h2 className="inputTitle">Uitleg toevoegen</h2>
              <input
                pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}"
                type="text"
                placeholder="Naam"
                value={newTermName}
                onChange={(e) => setNewTermName(e.target.value)}
              />
              <p className="error">{nameError}</p> {/* Red error text */}
              <textarea
                placeholder="Uitleg"
                value={newTermDescription}
                onChange={(e) => setNewTermDescription(e.target.value)}
              />
              <p className="error">{descriptionError}</p> {/* Red error text */}
              <div className="group">
                <button onClick={handleAddTerm}>Toevoegen</button>
              </div>
            </div>
          )}
          <button className="search">
            <input
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}"
              type="text"
              placeholder="Zoek een term ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </button>
        </div>
      </div>
      <div className="dataList">
        {filteredData.map((item, index) => (
          <div key={index} className="dataItem">
            <h2>{item.name}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
