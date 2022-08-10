using DALings;
using BLLings;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data;
using System.Threading.Tasks;
using System.Web;
using System.IO;

namespace NirSemesterB.Controllers
{
    [System.Web.Http.Cors.EnableCors(origins: "*", headers: "*", methods: "*")]
    public class FavoritesController : ApiController
    {
        // GET: Favorites
        public IHttpActionResult GET(int id)
        {
            try
            {
                DataTable Table = BLLUsers.ListOfFavorites(id);
                if (Table == null)
                {
                    return Content(HttpStatusCode.NotFound, $"User with id={id} was not found in DB! "/* + student2Return.ToString()*/);
                }

                return Ok(Table);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("api/AddImage/")]
        public IHttpActionResult AddImage(ImageToAdd image_to_add)
        {
            try
            {
                BLLUsers.AddImage(image_to_add);

                return Ok(HttpStatusCode.Accepted);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpPost]
        [Route("uploadpicture")]
        public Task<HttpResponseMessage> Post()
            {
                string output = "start---";
                List<string> savedFilePath = new List<string>();
                if (!Request.Content.IsMimeMultipartContent())
                {
                    throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
                }
                string rootPath = HttpContext.Current.Server.MapPath("~/Images");
                var provider = new MultipartFileStreamProvider(rootPath);
                var task = Request.Content.ReadAsMultipartAsync(provider).
                ContinueWith<HttpResponseMessage>(t =>
                {
                    if (t.IsCanceled || t.IsFaulted)
                    {
                        Request.CreateErrorResponse(HttpStatusCode.InternalServerError, t.Exception);
                    }

                foreach (MultipartFileData item in provider.FileData)
                {
                    try
                    {
                            output += " ---here";
                        string name = item.Headers.ContentDisposition.FileName.Replace("\"", "");
                            output += " ---here2=" + name;
                        //need the guid because in react native in order to refresh an inamge it has to have a new name
                        string newFileName = Path.GetFileNameWithoutExtension(name) + "_" + Guid.NewGuid() +
                        Path.GetExtension(name);
                            //string newFileName = name + "" + Guid.NewGuid();
                            output += " ---here3" + newFileName;
                        //delete all files begining with the same name
                        /*
                        string[] names = Directory.GetFiles(rootPath);
                        foreach (var fileName in names)
                        {
                            if (Path.GetFileNameWithoutExtension(fileName).IndexOf(Path.GetFileNameWithoutExtension(name)) != -
                            1)
                            {
                                File.Delete(fileName);
                            }
                        }
                        //File.Move(item.LocalFileName, Path.Combine(rootPath, newFileName));
                        File.Copy(item.LocalFileName, Path.Combine(rootPath, newFileName), true);
                        File.Delete(item.LocalFileName);
                        */
                            output += " ---here4";

                            Uri baseuri = new Uri(Request.RequestUri.AbsoluteUri.Replace(Request.RequestUri.PathAndQuery, string.Empty));
                            output += " ---here5";
                            string fileRelativePath = "~/Images/" + newFileName;
                            output += " ---here6 imageName=" + fileRelativePath;
                            Uri fileFullPath = new Uri(baseuri, VirtualPathUtility.ToAbsolute(fileRelativePath));
                            output += " ---here7" + fileFullPath.ToString();
                            savedFilePath.Add(fileFullPath.ToString());
                        }
                        catch (Exception ex)
                        {
                            output += " ---excption=" + ex.Message;
                            string message = ex.Message;
                        }
                    }
                    return Request.CreateResponse(HttpStatusCode.Created, "image " + savedFilePath[0] + "!" +
                    provider.FileData.Count + "!" + output + ":)");
                });
            return task;
        }


    }
}