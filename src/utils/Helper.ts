export function formatTimestamp(timestampString: String) {
    let dateFormatter = dateFormatter()
    dateFormatter.locale = Locale.current

    // Convert the timestamp string to a Date object
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    if let timestamp = dateFormatter.date(from: timestampString) {
        let now = Date()
        let timeInterval = now.timeIntervalSince(timestamp)

        if timeInterval < 7 * 24 * 60 * 60 {
            // The date is within the last week
            if Calendar.current.isDateInToday(timestamp) {
                // The date is today
                dateFormatter.dateFormat = "h:mm a"
                let formattedDate = dateFormatter.string(from: timestamp)
                print("Today \(formattedDate)")
                return formattedDate
            } else if Calendar.current.isDateInYesterday(timestamp) {
                // The date is yesterday
                dateFormatter.dateFormat = "'Yesterday' h:mm a"
                let formattedDate = dateFormatter.string(from: timestamp)
                print(formattedDate)
                return formattedDate
            } else {
                // The date is not today or yesterday
                dateFormatter.dateFormat = "E, h:mm a"
                let formattedDate = dateFormatter.string(from: timestamp)
                print(formattedDate)
                return formattedDate
            }
        } else {
            // The date is more than a week ago
            dateFormatter.dateFormat = "MMM d, h:mm a"
            let formattedDate = dateFormatter.string(from: timestamp)
            print(formattedDate)
            return formattedDate
        }
    } else {
        print("Invalid timestamp format")
        return ""
    }
}


export function formatFutureTimestamp(timestampString: String) {
    let dateFormatter = DateFormatter()
    dateFormatter.locale = Locale.current

    // Convert the timestamp string to a Date object
    dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    if let timestamp = dateFormatter.date(from: timestampString) {
        let now = Date()
        let timeInterval = now.timeIntervalSince(timestamp)

        if timeInterval < 7 * 24 * 60 * 60 {
            // The date is within the last week
            if Calendar.current.isDateInToday(timestamp) {
                // The date is today
                dateFormatter.dateFormat = "'Today'"
                let formattedDate = dateFormatter.string(from: timestamp)
                print("Today \(formattedDate)")
                return formattedDate
            } else if Calendar.current.isDateInTomorrow(timestamp) {
                // The date is yesterday
                dateFormatter.dateFormat = "'Tomorrow'"
                let formattedDate = dateFormatter.string(from: timestamp)
                print(formattedDate)
                return formattedDate
            }  else if Calendar.current.isDateInYesterday(timestamp) {
                // The date is yesterday
                dateFormatter.dateFormat = "'Yesterday'"
                let formattedDate = dateFormatter.string(from: timestamp)
                print(formattedDate)
                return formattedDate
            } else {
                // The date is not today or yesterday
                dateFormatter.dateFormat = "MMM d"
                let formattedDate = dateFormatter.string(from: timestamp)
                print(formattedDate)
                return formattedDate
            }
        } else {
            // The date is more than a week ago
            dateFormatter.dateFormat = "MMM d"
            let formattedDate = dateFormatter.string(from: timestamp)
            print(formattedDate)
            return formattedDate
        }
    } else {
        print("Invalid timestamp format")
        return ""
    }
}
export function formatDate(input: string | number | Date): string {
    const date = new Date(input)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  export const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)

  export const runAsyncFnWithoutBlocking = (
    fn: (...args: any) => Promise<any>
  ) => {
    fn()
  }

  export const sleep = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms))

  export const getStringFromBuffer = (buffer: ArrayBuffer) =>
    Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

  export enum ResultCode {
    InvalidCredentials = 'INVALID_CREDENTIALS',
    InvalidSubmission = 'INVALID_SUBMISSION',
    UserAlreadyExists = 'USER_ALREADY_EXISTS',
    UnknownError = 'UNKNOWN_ERROR',
    UserCreated = 'USER_CREATED',
    UserLoggedIn = 'USER_LOGGED_IN'
  }

  export const getMessageFromCode = (resultCode: string) => {
    switch (resultCode) {
      case ResultCode.InvalidCredentials:
        return 'Invalid credentials!'
      case ResultCode.InvalidSubmission:
        return 'Invalid submission, please try again!'
      case ResultCode.UserAlreadyExists:
        return 'User already exists, please log in!'
      case ResultCode.UserCreated:
        return 'User created, welcome!'
      case ResultCode.UnknownError:
        return 'Something went wrong, please try again!'
      case ResultCode.UserLoggedIn:
        return 'Logged in!'
    }
  }