export class RecordNotFound extends Error {
    constructor(message) {
        super(message)
        this.status = 404
        this.name = 'Record not found'
    }
}