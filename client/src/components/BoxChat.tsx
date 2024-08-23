import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function BoxChat() {
  return (
    <div
      className="flex-grow-1 h-100 p-3 overflow-hidden d-flex justify-content-between"
      style={{
        borderRadius: "var(--border-radius)",
        backgroundColor: "#e9ecf5",
      }}
    >
      <div
        className="bg-white py-3 shadow-sm"
        style={{
          borderRadius: "var(--border-radius)",
          width: "450px",
        }}
      >
        <div className="w-100 px-3 mb-3 position-relative">
          <input
            type="text"
            className="form-control rounded-pill fw-bold"
            placeholder="Search"
            style={{ backgroundColor: "#e9ecf5", padding: "8px 50px 8px 12px" }}
          />
          <div
            className="d-flex align-items-center justify-content-center rounded-circle ml-2 position-absolute top-0 h-100"
            style={{
              width: "auto",
              aspectRatio: "1/1",
              right: "16px",
              border: "1px solid #dee2e6",
              backgroundColor: "#e9ecf5",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon icon={faSearch} />
          </div>
        </div>
        <div className="list-friend mx-3 d-flex align-items-center gap-2 overflow-x-auto mb-3">
          <div className="d-flex flex-column align-items-center position-relative">
            <img
              src="https://scontent.fdad1-4.fna.fbcdn.net/v/t1.15752-9/454583821_1018517906242047_1037832760614467948_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFqGICRLsMdpmhCWZVEdV4oX98J-AHrGFhf3wn4AesYWLNMxYOhBQIg83QNUuFNISU57X2yBRk9z7P5rOpLCL0_&_nc_ohc=7Q_ZFTdXkpgQ7kNvgGqEZgO&_nc_ht=scontent.fdad1-4.fna&oh=03_Q7cD1QHLaUh-z3Dg4f1-eKQ0oSUzSxOdU3oKSJ1Y-0Dauombmg&oe=66EEB4DD"
              alt="Ảnh"
              className="rounded-circle mr-3"
              width={50}
              height={50}
            />
            <p className="fw-bold m-0">Duy</p>
            <div
              className="position-absolute end-0 rounded-circle"
              style={{
                width: "15px",
                height: "15px",
                top: "35px",
                backgroundColor: "#31a24c",
              }}
            ></div>
          </div>
        </div>
        <div
          className="d-flex flex-column overflow-y-auto"
          style={{ height: "400px" }}
        >
          <div className="d-flex align-items-center gap-2 position-relative py-2 px-3">
            <div>
              <img
                src="https://scontent.fdad1-4.fna.fbcdn.net/v/t1.15752-9/454583821_1018517906242047_1037832760614467948_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFqGICRLsMdpmhCWZVEdV4oX98J-AHrGFhf3wn4AesYWLNMxYOhBQIg83QNUuFNISU57X2yBRk9z7P5rOpLCL0_&_nc_ohc=7Q_ZFTdXkpgQ7kNvgGqEZgO&_nc_ht=scontent.fdad1-4.fna&oh=03_Q7cD1QHLaUh-z3Dg4f1-eKQ0oSUzSxOdU3oKSJ1Y-0Dauombmg&oe=66EEB4DD"
                alt="Ảnh"
                className="rounded-circle mr-3"
                width={50}
                height={50}
              />
              <div
                className="position-absolute rounded-circle"
                style={{
                  width: "15px",
                  height: "15px",
                  top: "43px",
                  left: "51px",
                  backgroundColor: "#31a24c",
                }}
              ></div>
            </div>
            <div className="flex-grow-1 pe-5">
              <span className="fw-bold">Duy</span>
              <div>
                <span className="fa-sm">Xin chào nha </span>
                <span className="message-footer fa-sm">- 8 giờ trước</span>
              </div>
            </div>
            <div
              className="position-absolute rounded-circle"
              style={{
                width: "15px",
                height: "15px",
                top: "50%",
                right: "36px",
                transform: "translateY(-50%)",
                backgroundColor: "#2e89ff",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoxChat;
