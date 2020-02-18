// NEXT ACTION: run at home, solve the mysteries at the bottom last line

// Never delete these.  Deliberate homemade examples!
// Next action is async bookmarks, from Eric Elliot et al
// ignore the first ten lines; Zakas counter from page 226, ES6
// let possiblyUnhandledRejections = new Map();
// process.on('unhandledRejection', (reason, promise) => {possiblyUnhandledRejections.set(promise, reason)} )
// process.on('rejectionHandled', (promise) => {possiblyUnhandledRejections.delete(promise)} )

// setInterval( ()=>{
//     console.log('hullo from an error counter...');
//     possiblyUnhandledRejections.forEach( (reason, promise) => {
//         console.log(reason.message ? reason.message : reason);
//     } )}
//     // possiblyUnhandledRejections.clear();
// , 3000);













const p = new Promise( (gold, tin) => {tin(42)} );
p.catch( (x)=>{console.log('1. oops' + x)} )
.then((x)=>{console.log('1. say ' + x + ' yeah')});  // 42 and UNDEFINED, respectively



const q = new Promise( (gold, tin) => {tin(42)} );
q.catch( (x)=>{console.log('2. oops' + x); return 'dirty shirt,'} )
.then((x)=>{console.log('2. say ' + x + ' yeah')});  // 42 and UNDEFINED, respectively

const r = Promise.resolve('Heineken');
r.catch( (x)=>{console.log('3. typeof x is ' + typeof x)} )
.then((x)=>{console.log('3. say ' + x + ' yeah')});  // 42 and UNDEFINED, respectively
// Totally skips to the second part, ignores the r.catch.

/*
const s = Promise.reject('Heineken');
s.then( (x)=>{console.log('typeof x is ' + typeof x)} ).then((x)=>{console.log('say ' + x + ' yeah')});  // 42 and UNDEFINED, respectively
//   UNHANDLED   REJECTION     WARNING    
*/

const t = Promise.resolve('Heineken');
t.then( (x)=>{console.log('5. typeof x is ' + typeof x)} )
.then((x)=>{console.log('5. say ' + x + ' yeah')});  // 42 and UNDEFINED, respectively
//  STRING    &&   undefined


const u = Promise.resolve('Heineken');
u.catch( (x)=>{console.log('6. typeof x is ' + typeof x)} )
.then((x)=>{console.log('6. say ' + x + ' yeah')});  // 42 and UNDEFINED, respectively
// Totally skips to the second part, ignores the r.catch.

Promise.resolve(7).
  then(() => Promise.resolve(77)).
  then(() => Promise.reject(new Error('7. Uhhhhhh... '))).
  then(() => console.log('7. This will not print')).
  catch( (err) => {
    err.message; // 'Oops!'
  });
/////////////////////// ACTUALLY, PRINTS NOTHING AT ALL.  SILENT

let vanilla = Promise.resolve(8);
  vanilla.then(() => Promise.resolve(88))
  .catch(() => {return new Error('8. Spitball!')})
  .then((poo) => console.log('8. Found this: ' + poo ))                /// CCCCCCCCCCC
  .catch(function errorHandler(err) {
    err.message; // SHOULD BE MANY UNHANDLED ERRORS. do in next one
  });  //  This prints FOUND THIS: 88


let cocoa = Promise.resolve(9);
  vanilla.then(() => Promise.resolve(99))
  .catch(() => {return new Error('9. Curveball!')})
  .then((poo) => console.log('9. Found this: ' + poo ))                /// CCCCCCCCCCC
  .catch(function errorHandler(err) {
    err.message; // SHOULD BE MANY UNHANDLED ERRORS. do in next one
  });  //  This prints FOUND THIS: 88
//////////////  unhandleds counter for unhandled handled errori 




// tally these using page 226
// What if someone is delayed?
const v = new Promise( (gold, tin) => {tin(42);  gold('10. LineOne KenGenest') } );

v.catch( (x)=>{console.log(     '10. LineTwo typeof x is ' + typeof x + ' and it is ' + x)} )  
.then((x)=>{ console.log('10. LineThree say ' + x + ' yeah'); return p;})
.then( (x)=> {  console.log(x + x + x);    
                setTimeout(() => {return '10. LineFour timerended'}, 100);  
            })
.catch( (err)=>{console.log('10. LineFive something like a ' + typeof err + ', for example ' + err)} )            /// CCCCCCCCCCC
  .then(() => {return new Error('10. Fastball!')})
  .then(() => {return reject(new Error('10. Screwball!'))})
  .then(() => {return new Error('10. Slider!')})
  .then(() => {return new Error('10. Changeup!')})
.catch( (err)=>{console.log('10. Line six: ' + err)} );   
//   MYSTERIES:
// AWOL:  Lines One and Four.
// Undefined REJECT.  Still undefined if you make it tin.

