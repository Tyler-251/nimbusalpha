export default function ParseDate(input) { //input is a string in the format "YYYY-MM-DDTHH:MM:SSZ"
    let year = parseInt(input.substring(0, 4));
    let month = parseInt(input.substring(5, 7)) - 1;
    let day = parseInt(input.substring(8, 10));
    let hour = parseInt(input.substring(11, 13));
    let minute = parseInt(input.substring(14, 16));
    return new Date(year, month, day, hour, minute);
}