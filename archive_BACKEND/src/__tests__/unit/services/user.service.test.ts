import { userService } from "../../../services/user.service";
import { User } from "../../../models/user.model";
import { sendResetCodeEmail } from "../../../services/email.service";

jest.mock("../../../services/email.service");
jest.mock("../../../models/user.model");

describe("userService.forgotPassword", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("should log error when email sending fails", async () => {
    const dto = { email: "test@example.com" };
    const mockUser = {
      email: "test@example.com",
      save: jest.fn().mockResolvedValue(undefined),
    };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (sendResetCodeEmail as jest.Mock).mockRejectedValueOnce(new Error("SMTP error"));

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await userService.forgotPassword(dto);

    expect(errorSpy).toHaveBeenCalledWith(
      "Failed to send reset email:",
      new Error("SMTP error")
    );
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("should not log anything if email sends successfully", async () => {
    const dto = { email: "test@example.com" };
    const mockUser = {
      email: "test@example.com",
      save: jest.fn().mockResolvedValue(undefined),
    };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (sendResetCodeEmail as jest.Mock).mockResolvedValueOnce(undefined);

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await userService.forgotPassword(dto);

    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("should return early without logging if user not found", async () => {
    const dto = { email: "missing@example.com" };
    (User.findOne as jest.Mock).mockResolvedValue(null);

    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await userService.forgotPassword(dto);

    expect(errorSpy).not.toHaveBeenCalled();
    expect(logSpy).not.toHaveBeenCalled();
  });
});
