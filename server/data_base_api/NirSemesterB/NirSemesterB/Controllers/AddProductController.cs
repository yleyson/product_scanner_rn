using DALings;
using BLLings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
 

namespace NirSemesterB.Controllers
{
    public class AddProductController : ApiController
    {
        public IHttpActionResult Post([FromBody] Product product)
        {

            try
            {
                Product product2Return = BLLUsers.AddProduct(product);
                if (product2Return == null)
                {
                    return Content(HttpStatusCode.NotFound, $"wrong details! "/* + student2Return.ToString()*/);
                }

                return Ok(product2Return);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


    }
}
