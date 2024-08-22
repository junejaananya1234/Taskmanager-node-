// importing all the important modules
const fs = require("fs").promises
const path = require("path")
const readline = require("readline")
//creating the filepath
const filepath = path.join(__dirname,"task.txt" );

//creating a function for userinput 

const userinput = (question)=>{
    const r1 = readline.createInterface({
        input : process.stdin,
        output: process.stdout,
    })
    return new Promise((resolve)=>{
        r1.question(question,(answer)=>{
           resolve(answer)
            r1.close()
           })
    })
   
}

  const addTask = async ()=>{
    try{
    const task = await userinput("Enter your task: ")
    try{
   // Check if the file exists
   await fs.access(filepath);
     // File exists, read its content
     const fileContent = await fs.readFile(filepath, "utf8");
       // Check if the file is blank and write the task accordingly
       if (fileContent.trim() === "") {
        await fs.writeFile(filepath, task);
      } else {
        await fs.appendFile(filepath, `\n${task}`);
      }
      console.log("Task added successfully!");
    }catch (notFoundError) {
        // if file doesnot exist create it and write it
        await fs.writeFile(filepath, task);
        console.log("Task added successfully!");
    }
    }
    catch(error){
 
        console.log(error);
  
    }
}

const viewFile = async () =>{
    try {
        const data = await fs.readFile(filepath, "utf8");
        return data.split("\n");
      } catch (error) {
        console.error(`Error reading file: ${error.message}`);
        return [];
      }
    
}

const markComplete = async () => {
    try {
      const data = await viewFile();
  
      if (data.length === 0) {
        console.log("No tasks available to mark as complete.");
        return;
      }
  
      if(data.length===1 && data[0].trim()===""){
        console.log('\nNo Tasks Added Yet\n');
        return
      };
  
      console.log("\nYour tasks are:");
      data.map((line, idx) => {
        console.log(`${idx + 1}. ${line}`);
      });
  
      let idx = Number(
        await userinput("Choose which task you want to mark as complete => ")
      );
  
      //--------- Validate user input for task index------------>
      if (isNaN(idx) || idx < 1 || idx > data.length) {
        console.log("Invalid task index. Please enter a valid number.");
        return;
      }
  
      data[idx - 1] = `[${data[idx - 1]}]`;
      await fs.writeFile(filepath, data.join("\n"));
  
      console.log("Task marked as completed.");
    } catch (error) {
      console.error(`Error marking task as complete: ${error.message}`);
    }
  };

  const removeTask = async () => {
    try {
      const data = await viewFile();
  
      if (data.length === 0) {
        console.log("No tasks available to remove.");
        return;
      }
  
      if(data.length===1 && data[0].trim()===""){
        console.log('\nNo Tasks Added Yet\n');
        return
      };
  
      console.log("\nYour tasks are:");
      data.map((line, idx) => {
        console.log(`${idx + 1}. ${line}`);
      });
  
      let idx = Number(
        await userinput("Choose which task you want to remove => ")
      );
  
      //--------- Validate user input for task index------------>
      if (isNaN(idx) || idx < 1 || idx > data.length) {
        console.log("Invalid task index. Please enter a valid number.");
        return;
      }
  
      const newData = data.filter((task, index) => index !== idx - 1);
      await fs.writeFile(filepath, newData.join("\n"));
  
      console.log("Task has been removed.");
    } catch (error) {
      console.error(`Error removing task: ${error.message}`);
    }
  };
  

 async function main(){
     while(true){
        console.log("\n 1. Add a new Task");
        console.log("2. View a list of Task");
        console.log("3. Mark a task as Completed");
        console.log("4. Remove a Task");
        console.log("5. Exit");
        
        
        const choice = await userinput("Enter your choice? ")
         switch (choice) {
            case "1":
                await addTask();
                break;
                case "2":
                    const data = await viewFile();
                    if(data.length===1 && data[0].trim()===""){
                      console.log('\nNo Tasks Added Yet\n');
                break;
                    };
                    if (data.length > 0) {
                        console.log("\nYour tasks are:");
                        data.map((line, idx) => {
                          console.log(`${idx + 1}. ${line}`);
                        });
                      } else {
                        console.log("No tasks available.");
                      }
                      break;
                case "3":
                    await markComplete();
                break;
                case "4":
                    await removeTask();
                break;
                case "5":
                    exit()
                break;
         
            default:
                break;
         }
     }
}
main()