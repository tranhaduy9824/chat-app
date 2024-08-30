export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (
  url: string,
  body: string | object,
  setProgress: (value: number) => void
) => {
  try {
    setProgress(20);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    setProgress(60);
    const data = await response.json();
    setProgress(100);

    if (!response.ok) {
      let message;

      setTimeout(() => {
        setProgress(-1);
      }, 800);
      if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }

      return { error: true, message };
    }

    setTimeout(() => {
      setProgress(-1);
    }, 800);
    return data;
  } catch (error) {
    setProgress(0);
    console.error("Error during post request:", error);
    return { error: true, message: "An unexpected error occurred" };
  }
};

export const getRequest = async (
  url: string,
  setProgress: (value: number) => void
) => {
  try {
    setProgress(20);

    const response = await fetch(url);
    setProgress(60);

    const data = await response.json();
    setProgress(100);

    if (!response.ok) {
      let message;

      setTimeout(() => {
        setProgress(-1);
      }, 800);

      if (data?.message) {
        message = data.message;
      } else {
        message = data;
      }

      return { error: true, message };
    }

    setTimeout(() => {
      setProgress(-1);
    }, 800);
    return data;
  } catch (error) {
    setProgress(0);
    console.error("Error during get request:", error);
    return { error: true, message: "An unexpected error occurred" };
  }
};
