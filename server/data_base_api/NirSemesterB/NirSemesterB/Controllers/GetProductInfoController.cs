using BLLings;
using DALings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace NirSemesterB.Controllers
{
    public class GetProductInfoController : ApiController
    {
        [HttpGet]
        [Route("api/GetProductInfo/{product_name}")]
        public IHttpActionResult GET(string product_name)
        {
            try
            {
                GetProduct productReturn = BLLUsers.Product(product_name);
                if (productReturn==null)
                {
                    return Content(HttpStatusCode.NotFound, $"product with name={product_name} wasnt found");
                }
                return Ok(productReturn);

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }

        [HttpGet]
        [Route("api/GetLastProduct/{user_id}")]
        public IHttpActionResult GET(int user_id)
        {
            try
            {
                LastProduct productReturn = BLLUsers.GetLastProductToAdd(user_id);
                if (productReturn == null)
                {
                    return Content(HttpStatusCode.NotFound, $"product with name={user_id} wasnt found");
                }
                return Ok(productReturn);

            }
            catch (Exception e)
            {

                return BadRequest(e.Message);
            }
        }


    }
}
