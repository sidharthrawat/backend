
let array=[2,3,4,5,6,2,5,9,3];
const douplicateElement=(array)=>{
    let sortedArray=array.slice().sort();
    const result = [];
    for(let i=0;i<=sortedArray.length-1;i++)
    {
        if(sortedArray[i]===sortedArray[i+1])
        {
            result.push(sortedArray[i]);
        }
    }
    return result;
}
console.log(`${douplicateElement(array)}`);