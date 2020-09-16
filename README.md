# Docker Adventure

Those notes based on the udemy course that being given by [Stephen Grider](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/).

### Why docker?

![Why Docker?](./zdocs/why-docker.png)

### What is docker?

![Docker ecosystem](./zdocs/docker-ecosystem.png)
![Image vs container](./zdocs/image-vs-container.png)

Container is a program with its own isolated set of hardware resources (own little space of memory, networking technology and hard drive)

Image is single file that has specifics to run a single program.
`docker run redis` for example: that would fetch the image from the docker hub (like GitHub but for docker images) and
run it and finally we will have our redis instance running in isolated container.

### How does `docker run hello-world` work?

![Docker hello-world](./zdocs/running-hello-world.png)

If image that ran is locally presented(in image cache), then directly will be run.
Otherwise, image will be retrieved from docker hub and then run. Subsequent runs will be as above (from the cache).

### How does container work?

To understand that, we need to look at how the operating system works.

![How container works](./zdocs/how-container-works.png)

All running programs will issue requests to the Kernel to interact with a piece of hardware.
So, the job of the kernel to govern access between running processes and hardware.

Assume the following scenario:

![How container works 2](./zdocs/how-container-works-2.png)

Two programs running, Chrome needs py2 to run where NodeJS needs py3. But in the hard disk, we only have access to py2.
So, NodeJS will not be able to work. How can we make both to work?

![How container works 3](./zdocs/how-container-works-3.png)

Operating systems have a feature called as **namespacing**. With it, we can look at all the hardware resources connected to computer
and we can **segment out** portions of those resources.

As shown on left, we segment our hard disk dedicated specifically house py2 and py3.

![How container works 4](./zdocs/how-container-works-4.png)

To properly make both processes work, they has to access their segments.

To ensure Chrome and NodeJS has access to right segments, the kernel will govern that access.

Thus, Chrome and NodeJS will be able to work on the same machine (as the example).

![Heart of docker: namespacing](./zdocs/heart-of-docker-namespacing.png)

Namespacing will isolate the hard drive resources per process/or for group of processes

Where control groups will limit the usage of the hard drives.

Specific to Linux OS

![Segmenting the hard drives](./zdocs/segmented-out-container.png)

So the container will be then **a running process/ or set of processes + segment of resources the process/es can talk to.**
The container **should not be thought** as a **physical construct**.

The simplified version of the container as shown below

![Simplified docker container](./zdocs/docker-inner-dynamics-nutshell.png)

### Relation between Image and Container

How does the **single image finally can create the container?**

![Simplified docker container](./zdocs/image-snapshot.png)

Whenever we talk about Image, we refer to a file system snapshot.
It is very specific set of directories and files that is required to run the process the image holds.

Image also has Startup Command that will isolate necessary hard drives and put file system
snapshot to a new segment inside the hard disk. Finally, the process will be run.

This is how the container then would look like
Chrome and Python placed into the segmented hard-drive

![Image details](./zdocs/image-details.png)

### How does docker run on my computer if namespacing is just specific for the Linux OS?

![Namespacing and other OS](./zdocs/namespacing-and-other-os.png)

When we installed docker for Win/Mac, we installed a Linux virtual machine.
So as long as docker running, the Linux virtual machine will be running in your computer.

Inside of this virtual machine, all the containers will be created
and the Linux kernel then will be able to do namespacing on your hardware.

### Commands

 - `docker ps`: shows running docker containers
 - `docker ps --all`: shows all containers that have ran
 - `docker system prune`: removes stopped containers, build cache, dangling images
 - `docker create <container name>`: creates a container, returns id of it
 - `docker start <container id>`: starts the container in silent mode, outputs wont display (contrary to docker run which is compose of create + start and shows logs)
 - `docker stop <container id>`: stops container and gives possibility to do cleanup etc.
 - `docker kill <container id>`: stops container immediately, no cleanup. If `docker stop` cannot stop the container in 10 sec, then this command automatically being run to kill process
 - `docker logs <container id>`: shows all the logs have been emitted while container working, does not re-run the container
 - `docker exec -it <container id> <command>`: allows us to run extra command in an already running container ex: running `docker run redis` and then the redis-cli inside the running container
 - `docker exec -it <container id> sh/bash/zsh/powershell…`: opens the terminal of the container
 - `docker build -f Dockerfile.dev .`: generates the image with a custom named dockerfile
 - `docker-compose rm`: removes generated docker-compose containers. Useful on re-runs if the `--build` does not do the trick
 - `docker-compose up/down`: starts related services of docker-compose and stops
 - `docker-compose ps`: shows running docker-compose containers

### Flags

 - `start -a`: shows the output of the container in the terminal window where it ran
 - `logs -f/--follow`: live log tracing
 - `exec -it`: allows us to provide input to the container
 - `run -it sh`: start the container with shell, keeps default commands from running. Ultimately good for testing stuff ex: NodeJS to run js codes like chrome devtools
 - `exec -i`: gets the typed stuff to the running processes STDIN. It runs the command

![Docker exec flag](./zdocs/docker-exec-flag.png)

 - `exec -t`: nicely formats + autocompletes (if command capable to do) the outputs on the screen

### Creating custom images

![Create docker image](./zdocs/creating-custom-image.png)

![Dockerfile basics](./zdocs/dockerfile-basics.png)

Downloading OS(base image) as alpine

By using `apk` package manager, redis being downloaded and installed onto OS

Writing a dockerfile is like **installing the chrome to a computer with no OS.**

![Dockerfile flow](./zdocs/dockerfile-flow.png)

![Dockerfile base image](./zdocs/dockerfile-base-image.png)

### Build process

In every step defined in dockerfile, a temporary container created to hold upcoming changes that are defined in that step.

![Docker build basic](./zdocs/docker-build-basic.png)

Created container`s id is at the bottom with alpine OS installed inside of it.

![Docker build second step](./zdocs/docker-build-2nd-step.png)

In second step, firstly the temporary container created, and necessary changes made on it(downloaded and installed the redis).
After, the snapshot of that container taken, and a final container being created because of the step. Temporary container then deleted

![Docker build third step](./zdocs/docker-build-3rd-step.png)

Lastly, the commands are put into startup command of another temporary container that created from the snapshot of the previous step.
A new container created from the snapshot and temporary deleted. Thus, the build process succeeds

![Docker build result](./zdocs/docker-build-result.png)

Below, overall flow can be seen.

![Docker build overall 1](./zdocs/docker-build-overall-1.png)

![Docker build overall 2](./zdocs/docker-build-overall-2.png)

If we run the docker build on the same dockerfile more than once, the cache mechanism will serve the already generated images for
unchanged steps inside the dockerfile. Starting from the changed step the temporary container creation flow will happen again. **Great for speed.**

### Tagging an image

![Docker tagging image](./zdocs/tagging-image.png)

![Docker tagging convention](./zdocs/tagging-convention.png)

### A NodeJS app with docker

We used alpine distro of Linux in previous examples as our base image. To create a NodeJS app, we need to have `npm` installed on our file system too.
There is two way to achieve that. Either we specify the installation of `npm` in the dockerfile or we use a base image that already have the `npm` in it.

`FROM node:alpine`
To follow the second scenario, we must download the `node:alpine` which is the Linux distro of alpine + NodeJS.

`COPY . .`
In NodeJS environment, dependencies of the application held in `package.json` file. When the docker run the `npm install` command to get
packages that being used at the project, the file must represent in the directory. To achieve that, we copy all the files of project to the docker
image`s filesystem with the command above.

At that point, the dockerized node app will successfully run. But when we try to access it on localhost address we simply
can`t (because of the isolated nature of the container). To overcome that, we need to run the container with an extra
argument to port incoming traffic from somewhere in the host machine to the container.

![Docker run port mapping](./zdocs/docker-run-port-mapping.png)

To specify a working directory, inside the dockerfile:

![Dockerfile workdir](./zdocs/dockerfile-workdir.png)

All the commands and instructions will be run relative to that directory.
That`s a good practice to define a working directory to not cause conflicts while copying project related files to the base images file system.

For example, if we change the content of `index.js` on the application and re-run the docker build process,
docker will recognize the changed file and will not use cached version of that step and on the following steps.
That is not good in terms of performance. To overcome that:

![Dockerfile optimization](./zdocs/dockerfile-optimization.png)

We can just copy the `package.json` file at first and run the `npm install` to get needed packages and then copy the rest of the project files.
In that way, we will not wait for re-install of node packages if we just change the project related files except the `package.json`.

It is a good convention to **copy just the bare minimum content in each successful step to avoid unnecessary step re-runs.**

### Docker compose

We need to specify what containers should be able to network between each other in a file called **docker-compose.yml.**

![Docker compose info](./zdocs/docker-compose-info.png)

We are using the example of NodeJS app + redis to discover docker-compose.
To establish communication between node app and redis, the docker-compose.yml file being used.

![Docker compose file](./zdocs/docker-compose-file.png)

Services are images that we want to communicate between each other. Their names (`redis-app` or `node-app`) are becoming
accessible references inside the source codes. Check out the `redis-app` reference at the `createClient` function.

![Docker compose service service name accessability](./zdocs/docker-compose-service-name-accessable.png)

The `6379` is the default port of the redis server.

### Docker compose commands

![Docker compose vs docker run](./zdocs/docker-compose-vs-run.png)

For some reason I could not see updated versions of my images when I ran that command. So had to re-build updated
image to see the change when I have run `docker-compose up`.

![Docker compose up](./zdocs/docker-compose-up.png)

When we run the `docker-compose up` command, it does run at the foreground.

![Docker compose up silent](./zdocs/docker-compose-up-silent.png)

And if we want to use the same terminal window then we can use the `-d` flag to run whole process in the background.
We can stop all the containers that started by the docker-compose with `docker-compose down`.

### Automatic container restart in docker-compose

![Docker compose restart policies](./zdocs/docker-compose-restart-policies.png)

Those policies can be defined in the services that being ran by the docker-compose.

![Docker compose file restart](./zdocs/docker-compose-file-restart.png)

### Checking the status of docker-composed containers

![Docker compose ps](./zdocs/docker-compose-ps.png)

All of the docker-compose commands work respect to a docker-compose.yml file. To successfully run those commands,
the corresponding `.yml` file must exist in the folder where we run them.

### Docker volumes

Volume is useful for having updated version of the source code inside the container without having to stop, re-build and re-start again.

Instead of copying the filesystem of the project to the inside of the container, reference of those sources placed.
Those references are pointing to the folders inside the local machine.

![Docker volumes referencing](./zdocs/docker-volumes-referencing.png)

![Docker volumes command](./zdocs/docker-volumes-command.png)

Most of the time its not a good way to type hefty of extra arguments to your commands. It is best to keep them simple and short.
To achieve that, we can use the power of docker-compose to simplify the command above and achieve the same result one short command.

![Docker compose file for volumes](./zdocs/docker-compose-file-for-volumes.png)

### Live updating tests

We can use the old command we learned, exec, to run additional commands inside of the already running container.

`docker exec -it <container-id> npm run test`

With that, whenever the content of tests change, they will automatically re-run.

### Production grade dockerfile

![Production version dockerfile](./zdocs/dockerfile-production-version.png)

There is two separate steps to make production version of react app to work. At first, the react application built. 
Then it served with the nginx server.

![Why nginx required for production?](./zdocs/docker-production-nginx.png)

We must have a server to serve files that are generated by the react build process. That is why we use the nginx there.

### Multi container application

![Multi container app architecture](./zdocs/multi-container-app-architecture.png)

- `nginx` will be responsible with routing requests to either `react-dev-server` or to the `Express API` that we created.
- There will be two data store
  - `redis` will be holding indexes and their calculated fibonacci values in memory
  - `postgres` will be holding indexes in persistent database
  
  ![Postgres and Redis usage in fibonacci calculator](./zdocs/postgres-redis-fibb.png)
  
  - `worker` will be responsible to listen `redis` events and calculate `fibonacci` values then store them on `redis`

#### Production flow of multi container application

Each separate container will have production `Dockerfile`.
All of the containers except the `client` will have almost exact configs as their development versions.

![Dockerfile and Dockerfile.dev comparison](./zdocs/dockerfile-and-dockerfile_dev.png)

`client` container's `Dockerfile` comparison will look like below

![Client's dockerfile comparison](./zdocs/client-dockerfile-comparison.png)

Also, we are going to build our react app so we need to serve it.
We can use our `Express` server to do that but we have another option: `nginx`.
It is claimed to be much faster to serve `static` files with `nginx`.
To integrate `nginx` to serve static files:

![Inner nginx config](./zdocs/inner-nginx-config.png)

![Multi container app - production flow](./zdocs/multi-container-app-production-flow.png)

## Kubernetes

Lets assume that we need to **scale** the application below according to workload we get.
As we know, **worker** is doing the **heavy-lifting** part which is responsible to calculate fibonacci values.
So, it is logical to see that we will need **more instances** of that container at some point.

![Traditional compose structure](./zdocs/traditional-compose-structure.png)

But it is not easy to achieve that in the world of elastic beanstalk (and probably in every other SaaS products).

![Elastic beanstalk scaling strategy](./zdocs/elastic-beanstalk-scaling-strategy.png)

Rather than creating the container that in need, EBS does create **whole set of containers** which is unnecessary.
The ideal way is to create only **what we in need** and that is what **kubernetes** allows us to have.

![Kubernetes details](./zdocs/kubernetes-details.png)

Each of the blue boxes (Nodes) here are a virtual machine or a physical computer that is going to run some number of containers.
Each of them can run different containers, images in various numbers. Nodes does not need to be **identical**.

All those different nodes are managed by **master**. Master has **control over** each of these **nodes** at any given time.
We **can interact** with kubernetes cluster by reaching out to this master.

![Kubernetes what and why](./zdocs/kubernetes-what-why.png)

![Working with kubernetes](./zdocs/workin-with-kubernetes.png)

![Minikube and Kubectl](./zdocs/minikube-kubectl.png)

**Minikube** is respobsile to create kubernetes cluster. It is only for **development**.
**Kubectl** will help us to interact kubernetes cluster and manage what the node should do. Both for **production** and **development**.

#### Comparison of Docker Compose to Kubernetes configuration

![Kkubernetes vs docker compose flow](./zdocs/kubernetes-vs-docker-compose-flow.png)

There is a naming convention while defining our configuration files for the kubernetes; `Pod` and `Node`. 

![Pod and Node naming convention on config files](./zdocs/pod-and-node-naming-convention-on-config-files.png)

When we look at the big picture of the Kubernetes and the pod relation, the relation is as below. `Node` being the environment to run container/s (must be closely related if there is more than one container) and the `Pod` is the grouping element. By using the `Pod` we will have the referencing by the container names while establishing the inter-communication of containers inside a single `Pod`.

![Big picture of kubernetes and pod relation](./zdocs/kubernetes-node-pod-big-picture.png)

![Pod vs Node](./zdocs/pod-vs-node-kubernetes.png)

Config files that we created (`client-pod.yml` or `client-node-port.yml`) does not create a container but they create something called `object`. To do that we will pass those config files to the `kubectl` and we will have our objects out of each file.

![Kubernetes object types](./zdocs/kubernetes-object-types.png)

The `kind` property inside the config files is an indication of the type of object that is going to created.

![apiVersion versioning details](./zdocs/apiVersion-versioning-detail.png)

According to choosen `apiVersion`, there will be different set of properties that we can use. We will change that according to whatever type of object that we need to create. Because we will need specific properties and those can be accessable through defining the right `apiVersion`.

#### Interaction between Service NodePort and Pod

![Kubernetes service Types](./zdocs/kubernetes-service-types.png)

The kubernetes Node is created by either Minikube or Docker Kubernetes according to configuration of the developer.

The service will establish a comminication layer between outside world and the container that is running inside the pod.
`kube-proxy` automatically generated for every single member of the kubernetes cluster and it is the window to outside world. It will inspect the incoming request and will decide how to route it to different services/pods inside of the kubernetes node.

![Interaction between service and pod](./zdocs/interaction-between-service-and-pod-kubernetes.png)

#### NodePort Service ports in detail

- `port`: used to accept connection from other pod/s that needs to connect `multi-client` pod
- `targetPort`: the port that `multi-client` working on
- `nodePort`: browser going to access to `multi-client` from that port

![Ports in detail - Service](./zdocs/kubernetes-service-ports-in-detail.png)

### Kubectl Commands

 - `kubectl apply -f <config file>`: generates a new object out of the configuration file. `-f` says we have a config file for that
 - `kubectl get pods`: retrieves information about generated pod objets. `-o wide` to have more details.
 - `kubectl get services`: retrieves information about generated service objects
 - `kubectl get deployments`: retrieves information about generated deployment objects
 - `kubectl delete <object type>/<object name>`: removes the generated object
 - `kubectl delete -f <config file>`: removes the generated object according to given config file
 - `kubectl describe <object type> <object name>`: retrieves detailed info about an object
 - `kubectl logs <object name>`: retrieves the logs created inside of the container of the object
 - `kubectl exec -it <object name> sh`: starts up a shell inside the container of the object

#### Kubernetes deployment flow

If a container somehow gets terminated, the master will be notified about that. It will issue necessary commands to start back that missing container in an appropriate node. Master constantly will work to fullfil the issued needs of the developer.

![Kubernetes deployment flow](./zdocs/kubernetes-entire-deploymeny-flow.png)

#### Takeaways of Kubernetes

![Takeaways of Kubernetes](./zdocs/kubernetes-takeaways.png)

#### Declarative vs. Imperative Deployments

There is two way to convey what we want from Kubernetes to do: declarative or imperative approach. 
Mostly, declarative approach used by the community. Beacuse, most of the work handled by the internals of the Kubernetes in that way. It way more easier than imperative approach. 

![Declarative vs Imperative Deployment](./zdocs/kubernetes-declarative-vs-imperative-deployment.png)

#### Updating an existing Pod

If a pod has already created, we can update it by manipulating the existing config file of it. We need to keep the `name` and `kind` property the same and changing other parameters will make the update. Otherwise, a new object will be created.

![Updating an existing pod](./zdocs/kubernetes-update-existing-pod.png)

But, we can't change all the properties after an `Pod` object has created. This is a limitation specific to the `kind` of `Pod`. There is another `kind` called `Deployment` which enables us to update each `Pod` inside of it.

![Pods to deployments](./zdocs/kubernetes-pods-to-deployments.png)

#### Why we use Services?

Every created pod will have its own IP address. We can directly access a pod with its IP address. What if the pod gets killed? The `kubectl` will start a new pod and will assign it a random IP address. At that moment, we won't be able to access the newly created pod.

Thats why we are using the `Service`. It will hold the necessary info about the created pods and will provide a static access point. It won't get effected by the internal changes about the pods getting deleted/re-created.

#### Updating a deployment image

Let's say we made some changes to our docker image and want to update our kubernetes pods according to it. To achieve that, we need to set the image name via an imperative command.

 - `kubectl set image <object type>/<object name> <container name>=<new image name>`

We would have it as
 - `kubectl set image deployment/client-deployment client=stephengrider/multi-client:v8`

With that, all the pods with given container name will have their image name set to the given parameter.