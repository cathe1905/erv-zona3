export function capitalize(str){
    if (!str || str.charAt(0) === str.charAt(0).toUpperCase()){
        return str;
    }

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}