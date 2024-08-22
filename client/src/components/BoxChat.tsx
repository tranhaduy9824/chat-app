import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function BoxChat() {
  return (
    <div
      className="flex-grow-1 h-100 bg-white p-3 overflow-hidden"
      style={{ borderRadius: "var(--border-radius)" }}
    >
      <div>
        <div>
          <div>
            <input type="text" />
            <div>
              <FontAwesomeIcon icon={faSearch} />
            </div>
          </div>
          <div>
            <div>
              <img
                src="https://scontent.fdad1-4.fna.fbcdn.net/v/t1.15752-9/454583821_1018517906242047_1037832760614467948_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFqGICRLsMdpmhCWZVEdV4oX98J-AHrGFhf3wn4AesYWLNMxYOhBQIg83QNUuFNISU57X2yBRk9z7P5rOpLCL0_&_nc_ohc=7Q_ZFTdXkpgQ7kNvgGqEZgO&_nc_ht=scontent.fdad1-4.fna&oh=03_Q7cD1QHLaUh-z3Dg4f1-eKQ0oSUzSxOdU3oKSJ1Y-0Dauombmg&oe=66EEB4DD"
                alt="Ảnh"
              />
              <p>Duy</p>
              <div></div>
            </div>
          </div>
          <div>
            <div>
              <div>
                <img
                  src="https://scontent.fdad1-4.fna.fbcdn.net/v/t1.15752-9/454583821_1018517906242047_1037832760614467948_n.png?_nc_cat=100&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFqGICRLsMdpmhCWZVEdV4oX98J-AHrGFhf3wn4AesYWLNMxYOhBQIg83QNUuFNISU57X2yBRk9z7P5rOpLCL0_&_nc_ohc=7Q_ZFTdXkpgQ7kNvgGqEZgO&_nc_ht=scontent.fdad1-4.fna&oh=03_Q7cD1QHLaUh-z3Dg4f1-eKQ0oSUzSxOdU3oKSJ1Y-0Dauombmg&oe=66EEB4DD"
                  alt="Ảnh"
                />
                <div></div>
              </div>
              <div>
                <span>Duy</span>
                <div>
                  <span>Xin chào nha</span>
                  <span className="message-footer">8 giờ trước</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoxChat;
