export const handleErrorMessage = (error: any, setErrorMessage: (message: string) => void) => {
    let errorMessage = error.message;
    if (typeof errorMessage === "string") {
      const parts = errorMessage.split("Error: ");
      errorMessage = parts[1] ? parts[1] : "Error en la información ingresada";
    }
    setErrorMessage(errorMessage);
  };