const fs=require('fs');
const http=require('http');
const url=require('url');

const slugify=require('slugify');

 const templateCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
 const templateOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
 const templateProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

 const data=fs.readFileSync(`${__dirname}/data/data.json`,'utf-8');
const dataObj=JSON.parse(data);

const replaceTemplate=(temp,product)=>{
    let output=temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output=output.replace(/{%IMAGE%}/g, product.image);
    output=output.replace(/{%FROM%}/g, product.from);
    output=output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output=output.replace(/{%QUANTITY%}/g, product.quantity);
    output=output.replace(/{%PRICE%}/g, product.price);
    output=output.replace(/{%ID%}/g, product.id);
    output=output.replace(/{%DESCRIPTION%}/g, product.description);
    if(!product.organic){output=output.replace(/%NOT_ORGANIC%/g, 'not-organic')}
    return output;

}
const slugs=dataObj.map(e=>slugify(e.productName,{lower:true}))
console.log(slugs);
const server=http.createServer((req,res)=>{
    
    const { query, pathname } = url.parse(req.url, true);

if(pathname==='/'||pathname==='/overview'){res.writeHead(200,{'content-type':'text/html'})
const cardHTML=dataObj.map(el=> replaceTemplate(templateCard,el)).join('');
const output=templateOverview.replace('{%PRODUCT_CARDS%}',cardHTML)
res.end(output)}


else if(pathname==='/product'){
    res.writeHead(200, {
        'Content-type': 'text/html'
      });
      const product = dataObj[query.id];
      const output = replaceTemplate(templateProduct, product);
      res.end(output);
}

else if(pathname==='/api'){res.writeHead(200,{'content-type':'application/json'})
res.end(data)}

else{res.writeHead(400,{'content-type':'text/html'})
res.end('<h1>PAGE NOT FOUND</h1>')}
  


});



server.listen(8000,'127.0.0.1',()=>{console.log("app is running at the port 8080")})