// const fs = require('fs');

const allBoard = 
["a1", "a2", "a3", "a4", "a5", 
"b1", "b2", "b3", "b4", "b5", "b6",
"c1", "c2", "c3", "c4", "c5", "c6", "c7", 
"d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", 
"e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", 
"f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9",
"g3", "g4", "g5", "g6", "g7", "g8", "g9",
"h4", "h5", "h6", "h7", "h8", "h9",
"i5", "i6", "i7", "i8", "i9"];


//To do..
//This should be imported through "input.board"

// const inputFile = ["A3b","B2b","B3b","C1b", "C2b", "C3b","C4b", "D4b", "G7b","G8b","H7b","H8b","H9b","I8b","I9b","A4w","A5w","B4w","B5w","B6w","C5w","C6w","G4w","G5w","H4w","H5w","H6w","I5w","I6w"];
// const inputFile = ["I5b", "H5b", "G5b"];
//const inputFile = ["D3b", "D4b", "D5b"];
//const nextTurn = 'w';
// const inputFile = ["A3b","B2b","B3b","C3b","C4b","G7b","G8b","H7b","H8b","H9b","I8b","I9b","A4w","A5w","B4w","B5w","B6w","C5w","C6w","G4w","G5w","H4w","H5w","H6w","I5w","I6w"];
// const nextTurn = 'w';

const fileData = JSON.parse(localStorage.getItem("input"));

const inputFile = fileData["positions"];
const nextTurn = fileData["turn"];
const fileName = fileData["fName"];

console.log(inputFile);
console.log(nextTurn);
console.log(fileName);


let newMarblesP1 = []; // contains user's marble(all black)
let newMarblesP2 = []; // contains computer's marble(all white)
let emptyLocation =[]; // contains empty location;
let resultsInline = [];
let resultsSideStep = [];
let adjacentInfo = {}; // key : marble, value : marble's adjacent
let currentMarbles; // depends on turn // logic --> nextTurn==='w'? newMarblesP1:newMarblesP2;
let oppositeMarbles; // depends on turn //logic --> nextTurn==='w'? newMarblesP1:newMarblesP2;


function turn() {    
    generateBoardWInput();
}

//this is to show board based on "input.board"
function generateBoardWInput() {
    emptyBoard();

    //read "input.board" (ex, "A3b", "B2b"..) and set background to marble and 
    //push it to newMarblesP1, newMarblesP2
    for(let i =0; i<inputFile.length;i++) {
        let location = (inputFile[i].substring(0, 1)).toLowerCase()+inputFile[i].substring(1, 2);
        let marbleColor = inputFile[i].substring(2, 3);
        
        if(marbleColor==='b') {
            document.getElementById(location).style.background=blackMarbleColour;
            newMarblesP1.push(location);
        }else {
            document.getElementById(location).style.background=whiteMarbleColour;
            newMarblesP2.push(location);
        }
     
        
    }
    // set empty location
    for(let i =0; i<allBoard.length;i++) {
        if(!newMarblesP1.includes(allBoard[i]) && !newMarblesP2.includes(allBoard[i])) {
            emptyLocation.push(allBoard[i]);
        }
    }

    stateGenerator()
}

// This is to figure out current Marble(who's turn)'s and oppositeMarble's adjacent
function stateGenerator() {
    let cur = [];
    let next = [];
    currentMarbles = nextTurn==='w'? newMarblesP1:newMarblesP2;
    oppositeMarbles = nextTurn ==='w'?newMarblesP2:newMarblesP1;
    
    for(let i =0; i<currentMarbles.length;i++) {
        cur =getAdjacent(currentMarbles[i]);
    }
    for(let i =0; i<oppositeMarbles.length;i++) {

        next =getAdjacent(oppositeMarbles[i]);

    }
    for(let i =0; i<emptyLocation.length;i++) {

        next =getAdjacent(emptyLocation[i]);

    }
   
    move(cur, next);
    // console.log(resultsInline);
    // console.log(adjacentInfo)
    
} 


//find how it can be moves
function move(cur, next) {
    let temp;
    let emptyArray =[];
    //     move one marble
    for(let i =0; i<currentMarbles.length;i++) {
        resultsInline.push("This is " + currentMarbles[i]); 
        resultsSideStep.push("This is "+currentMarbles[i]);

        emptyArray=[];
        for(let j=0;j<cur[currentMarbles[i]].length;j++) {
            if(emptyLocation.includes(cur[currentMarbles[i]][j])) {
                emptyArray.push(j);
            }
        }
        
    
        for(let j=0;j<cur[currentMarbles[i]].length;j++) {
            temp = (cur[currentMarbles[i]])[j];
            result = findingInlineSideStep(cur, next, currentMarbles[i], temp, j, 1, 0); 

            if(result!=null && result!=undefined) {
                
                resultsInline.push("i"+"-"+currentMarbles[i]+"-"+result);
            }

        }
          
        for(let j=0;j<cur[currentMarbles[i]].length;j++) {
            temp = (cur[currentMarbles[i]])[j];
            
            sideStep(cur, currentMarbles[i], temp, j, emptyArray);
            
        }

    }
    console.log(resultsInline)
    console.log(resultsSideStep)
}


function sideStep(cur, marble, adjacentMarble, direction, emptyArray) {
    
    let sideStepResult = [];
    if(marble.substring(0,1)=='x') {
        return null;
    }
    if(adjacentMarble.substring(0,1)=='x') {
        return null;
    }
    if(emptyArray.length==0) {
        return null;
    }
    if(!currentMarbles.includes(adjacentMarble)) {
        return null;
    }

    //target1 and target 2 are two adjacent marble between current Marble and adjacentMarble
    // for example, current marble is "B3", adjacentMarble is "C4"
    //target 1 and 2 will be "C3", and "B4"
    
    let target1;
    let target2;
    let booleanChecking = 0;

    //direction is the index of the adjacent marble. 
    //target1 and 2 set to adjacent index marble
    if(direction==0) {
        target1= 1;
        target2= 2;
    }else if(direction ==1) {
        target1= 3;
        target2= 0;
    }else if(direction ==2) {
        target1= 0;
        target2= 4;
    }else if(direction ==3) {
        target1= 5;
        target2= 1;
    }else if(direction ==4) {
        target1= 2;
        target2= 5;
    }else if(direction ==5) {
        target1= 4;
        target2= 3;
    }
    //This is to check target1 are empty or not
    //if not empty, it cannot move to sidestep. 
    //if empty, it checks adjacent marbles of target1 on the same direction and opposite direction 
    if(emptyArray.includes(target1)) {    
        if(emptyLocation.includes(adjacentInfo[(cur[marble])[target1]][direction])) {
            
            booleanChecking+=1;
            let n = target1

            let realNo;
            if(n==0) {
                realNo= 7;
            }else if(n ==1) {
                realNo= 5;
            }else if(n ==2) {
                realNo= 9;
            }else if(n ==3) {
                realNo= 3;
            }else if(n ==4) {
                realNo= 11;
            }else if(n ==5) {
                realNo= 1;
            }
            // console.log("This is 2level s-"+ marble+"-"+adjacentMarble + "-"+realNo)
            resultsSideStep.push("s-"+ marble+"-"+adjacentMarble + "-"+realNo)
        }
        if(emptyLocation.includes(adjacentInfo[(cur[marble])[target1]][5-direction])) {
            // sideStepResult.push((cur[marble])[target1]+"damm"+adjacentInfo[(cur[marble])[target1]][5-direction])
            booleanChecking+=1;
            let n = adjacentInfo[(cur[marble])[direction]].indexOf((cur[marble])[target1]);
            let realNo;
            if(n==0) {
                realNo= 7;
            }else if(n ==1) {
                realNo= 5;
            }else if(n ==2) {
                realNo= 9;
            }else if(n ==3) {
                realNo= 3;
            }else if(n ==4) {
                realNo= 11;
            }else if(n ==5) {
                realNo= 1;
            }
            // console.log("This is 2level s-"+ marble+"-"+adjacentMarble + "-"+realNo)
            resultsSideStep.push("s-"+ marble+"-"+adjacentMarble + "-"+realNo)
            
        }   
     
        if(booleanChecking==2 && currentMarbles.includes(cur[adjacentMarble][direction])) {
            let n = adjacentInfo[(cur[marble])[direction]].indexOf((cur[marble])[target1]);
            if(n==0) {
                realNo= 7;
            }else if(n ==1) {
                realNo= 5;
            }else if(n ==2) {
                realNo= 9;
            }else if(n ==3) {
                realNo= 3;
            }else if(n ==4) {
                realNo= 11;
            }else if(n ==5) {
                realNo= 1;
            }
            // console.log("This is 3level s-"+ marble+"-"+cur[adjacentMarble][direction] +"-"+realNo)
            resultsSideStep.push("s-"+ marble+"-"+cur[adjacentMarble][direction] +"-"+realNo)

            if(emptyLocation.includes(adjacentInfo[adjacentInfo[(cur[marble])[target1]][direction]][direction])) {
                let n = adjacentInfo[cur[adjacentMarble][direction]].indexOf(adjacentInfo[adjacentInfo[(cur[marble])[target1]][direction]][direction])
                if(n==0) {
                    realNo= 7;
                }else if(n ==1) {
                    realNo= 5;
                }else if(n ==2) {
                    realNo= 9;
                }else if(n ==3) {
                    realNo= 3;
                }else if(n ==4) {
                    realNo= 11;
                }else if(n ==5) {
                    realNo= 1;
                }
                // console.log(n)
                // console.log("This is 3level s-"+ marble+"-"+cur[adjacentMarble][direction] +"-"+realNo)
                resultsSideStep.push("s-"+ marble+"-"+cur[adjacentMarble][direction] +"-"+realNo)
            }
        }
        booleanChecking=0;

    }
    //This is to check target2 are empty or not
    //if not empty, it cannot move to sidestep. 
    //if empty, it checks adjacent marbles of target2 on the same direction and opposite direction 
    if(emptyArray.includes(target2)) {    

        if(emptyLocation.includes(adjacentInfo[(cur[marble])[target2]][direction])) {
            // sideStepResult.push((cur[marble])[target2]+"damm"+adjacentInfo[(cur[marble])[target2]][direction])
            booleanChecking+=1;
            let n = target2
            let realNo;
            if(n==0) {
                realNo= 7;
            }else if(n ==1) {
                realNo= 5;
            }else if(n ==2) {
                realNo= 9;
            }else if(n ==3) {
                realNo= 3;
            }else if(n ==4) {
                realNo= 11;
            }else if(n ==5) {
                realNo= 1;
            }
            // console.log("This is 2level s-"+ marble+"-"+adjacentMarble + "-"+realNo)
            resultsSideStep.push("s-"+ marble+"-"+adjacentMarble + "-"+realNo)
        }
        if(emptyLocation.includes(adjacentInfo[(cur[marble])[target2]][5-direction])) {
            // sideStepResult.push((cur[marble])[target2]+"damm"+adjacentInfo[(cur[marble])[target2]][5-direction])
            booleanChecking+=1;
            let n = adjacentInfo[(cur[marble])[direction]].indexOf((cur[marble])[target2]);

            let realNo;
            if(n==0) {
                realNo= 7;
            }else if(n ==1) {
                realNo= 5;
            }else if(n ==2) {
                realNo= 9;
            }else if(n ==3) {
                realNo= 3;
            }else if(n ==4) {
                realNo= 11;
            }else if(n ==5) {
                realNo= 1;
            }
            // console.log("This is 2level s-"+ marble+"-"+adjacentMarble + "-"+realNo)
            resultsSideStep.push("s-"+ marble+"-"+adjacentMarble + "-"+realNo)
            
        }   
        if(booleanChecking==2 && currentMarbles.includes(cur[adjacentMarble][direction])) {
            let n = adjacentInfo[(cur[marble])[direction]].indexOf((cur[marble])[target2]);
            if(n==0) {
                realNo= 7;
            }else if(n ==1) {
                realNo= 5;
            }else if(n ==2) {
                realNo= 9;
            }else if(n ==3) {
                realNo= 3;
            }else if(n ==4) {
                realNo= 11;
            }else if(n ==5) {
                realNo= 1;
            }
            // console.log("This is 3level s-"+ marble+"-"+cur[adjacentMarble][direction] +"-"+realNo)
            resultsSideStep.push("s-"+ marble+"-"+cur[adjacentMarble][direction] +"-"+realNo)

            if(emptyLocation.includes(adjacentInfo[adjacentInfo[(cur[marble])[target2]][direction]][direction])) {
                let n = adjacentInfo[cur[adjacentMarble][direction]].indexOf(adjacentInfo[adjacentInfo[(cur[marble])[target2]][direction]][direction])
                if(n==0) {
                    realNo= 7;
                }else if(n ==1) {
                    realNo= 5;
                }else if(n ==2) {
                    realNo= 9;
                }else if(n ==3) {
                    realNo= 3;
                }else if(n ==4) {
                    realNo= 11;
                }else if(n ==5) {
                    realNo= 1;
                }
                // console.log(n)
                // console.log("This is 3level s-"+ marble+"-"+cur[adjacentMarble][direction] +"-"+realNo)
                resultsSideStep.push("s-"+ marble+"-"+cur[adjacentMarble][direction] +"-"+realNo)
            }
        }
        
        booleanChecking=0;

    }
    
}






// cur, opp is depending on turn, 
// marble is the one that we want to find its move
// adjacentMarble is the marble's adjacent
//direction can be known through index of array

function findingInlineSideStep(cur, next, marble, adjacentMarble, direction, cntCurMarble, cntOpMarble) {

    if(marble.substring(0,1)=='x') {
        return null;
    }
    if(adjacentMarble.substring(0,1)=='x') {
        return null;
    }
    if(cntCurMarble>3) {
        return null;
    }
    
    if(emptyLocation.includes(adjacentMarble)) {
        if(cntCurMarble>cntOpMarble) {

            if(direction==0) {
                return 7;
            }else if(direction ==1) {
                return 5;
            }else if(direction ==2) {
                return 9;
            }else if(direction ==3) {
                return 3;
            }else if(direction ==4) {
                return 11;
            }else if(direction ==5) {
                return 1;
            }
            return direction;
        }
        
    }else if(oppositeMarbles.includes(adjacentMarble)){ 
        return findingInlineSideStep(cur, next, adjacentMarble, (next[adjacentMarble])[direction],direction, cntCurMarble, cntOpMarble+=1);
    }else if(currentMarbles.includes(adjacentMarble)) {
        return findingInlineSideStep(cur, next, adjacentMarble, (cur[adjacentMarble])[direction],direction, cntCurMarble+=1, cntOpMarble);
    }
    
}





//make board to all empty
function emptyBoard() {
    for(let i =0; i<allBoard.length;i++) {
        document.getElementById(allBoard[i]).style.background=null;
    }
}  

// This is to get adjacent 
// to make it easy to figure out direction(==array's index)
// added "x" for null value
function getAdjacent(marble) {
    let alphabet = marble.substring(0, 1)
    let number = marble.substring(1, 2)
    
    let adjacent = [];
    let adjacentAlphabet = [];
    let adjacentNumber = [];
    
    if(alphabet=='a') {
        adjacentAlphabet = ['x', 'a', 'b']
    }else if(alphabet=='b') {
        adjacentAlphabet = ['a', 'b', 'c']
    }else if(alphabet=='c') {
        adjacentAlphabet = ['b', 'c', 'd']
    }else if(alphabet=='d') {
        adjacentAlphabet = ['c', 'd', 'e']
    }else if(alphabet=='e') {
        adjacentAlphabet = ['d', 'e', 'f']
    }else if(alphabet=='f') {
        adjacentAlphabet = ['e', 'f', 'g']
    }else if(alphabet=='g') {
        adjacentAlphabet = ['f', 'g', 'h']
    }else if(alphabet=='h') {
        adjacentAlphabet = ['g', 'h', 'i']
    }else if(alphabet=='i') {
        adjacentAlphabet = ['h', 'i', 'x']
    }
    
    if(number==1) {
        adjacentNumber = [0, 1, 2]
    }else if(number==2) {
        adjacentNumber = [1,2,3]
    }else if(number==3) {
        adjacentNumber = [2,3,4]
    }else if(number==4) {
        adjacentNumber = [3,4,5]
    }else if(number==5) {
        adjacentNumber = [4,5,6]
    }else if(number==6) {
        adjacentNumber = [5,6,7]
    }else if(number==7) {
        adjacentNumber = [6,7,8]
    }else if(number==8) {
        adjacentNumber = [7,8,9]
    }else if(number==9) {
        adjacentNumber = [8,9,0]
    }
    

    //MAKE ADJACENT ALL 
    for(let i =0; i<adjacentAlphabet.length;i++) {
        for(let j=0;j<adjacentNumber.length;j++) {
            let candidate = adjacentAlphabet[i]+adjacentNumber[j];
            if(adjacentAlphabet[i]<alphabet && adjacentNumber[j]<=number) {
                adjacent.push(candidate);
            }
            if(adjacentAlphabet[i]>alphabet && adjacentNumber[j]>=number) {
                adjacent.push(candidate);
            }
            //remove if the marble is smae with the current marble
            if(adjacentAlphabet[i]==alphabet &&candidate!=marble) {
                adjacent.push(candidate);
            }
            // console.log(adjacent)
            
        }
        adjacentInfo[marble] = adjacent
    }
   
    return adjacentInfo


}