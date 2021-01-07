﻿using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ServerApp.Models;

namespace ServerApp.Controllers
{
    public class HomeController : Controller
    {
        private DataContext context;

        private readonly ILogger<HomeController> _logger;

        public HomeController(DataContext ctx)
        {
            context = ctx;
        }

        /*
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }
         */


        public IActionResult Index()
        {
            return View(context.Albums.First());
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
