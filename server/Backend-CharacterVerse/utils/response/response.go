package response

const (
	StatusSuccess       = 200
	StatusBadRequest    = 400
	StatusUnauthorized  = 401
	StatusForbidden     = 403
	StatusNotFound      = 404
	StatusInternalError = 500
)

type Response struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data"`
}

func Success(data interface{}) *Response {
	return &Response{
		Code:    StatusSuccess,
		Message: "success",
		Data:    data,
	}
}

func SuccessWithMessage(message string, data interface{}) *Response {
	return &Response{
		Code:    StatusSuccess,
		Message: message,
		Data:    data,
	}
}

func Error(code int, message string) *Response {
	return &Response{
		Code:    code,
		Message: message,
		Data:    nil,
	}
}

func BadRequest(message string) *Response {
	return Error(StatusBadRequest, message)
}

func Unauthorized(message string) *Response {
	return Error(StatusUnauthorized, message)
}

func Forbidden(message string) *Response {
	return Error(StatusForbidden, message)
}

func NotFound(message string) *Response {
	return Error(StatusNotFound, message)
}

func InternalError(message string) *Response {
	return Error(StatusInternalError, message)
}
