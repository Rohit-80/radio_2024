import { v4 as uuid } from "uuid";
import { PassThrough } from "stream";
import Throttle from "throttle";
import { ffprobe } from "@dropb/ffprobe";
import ffprobeStatic from "ffprobe-static";
import { readdir } from "fs/promises";
import { createReadStream } from "fs";
import { extname, join } from "path";
import io from 'socket.io-client'
ffprobe.path = ffprobeStatic.path;

class Queue {
    constructor() {
        this.tracks = [];
        this.index = 0;
        this.clients = new Map();
        this.bufferHeader = null;
    }

    current() {
        return this.tracks[this.index];
    }

    broadcast(chunk) {
        this.clients.forEach((client) => {
            client.write(chunk);
        });
    }

    addClient() {
        const id = uuid();
        const client = new PassThrough();

        this.clients.set(id, client);
        // console.log('client added')
       
        return { id, client };
    }

    removeClient(id) {
        io('http://localhost:3000').emit('deladd');
        // console.log('client removed')
        this.clients.delete(id);
    }

    async loadTracks(dir) {
        let filenames = await readdir(dir);
        filenames = filenames.filter(
            (filename) => extname(filename) === ".mp3"
        );

        // Add directory name back to filenames
        const filepaths = filenames.map((filename) => join(dir, filename));

        const promises = filepaths.map(async (filepath) => {
            const bitrate = await this.getTrackBitrate(filepath);

            return { filepath, bitrate };
        });

        this.tracks = await Promise.all(promises);
        console.log(`Loaded ${this.tracks.length} tracks`);
    }

    async getTrackBitrate(filepath) {
        const data = await ffprobe(filepath);
        const bitrate = data?.format?.bit_rate;

        return bitrate ? parseInt(bitrate) : 128000;
    }

    getNextTrack() {
        // Loop back to the first track
        if (this.index >= this.tracks.length - 1) {
            this.index = 0;
        }

        const track = this.tracks[this.index++];
        this.currentTrack = track;

        return track;
    }

    pause() {
        if (!this.started() || !this.playing) return;
        this.playing = false;
        console.log("Paused");
        this.throttle.removeAllListeners("end");
        this.throttle.end();
    }

    resume() {
        console.log("Resumed",!this.started() , this.playing);
        if (!this.started() || this.playing) return;
        console.log("Resumed2");
        this.start();
    }

    started() {
        return this.stream && this.throttle && this.currentTrack;
    }

    // Play new track if there's no current track or useNewTrack is true
    // Otherwise, resume the current track
    play(useNewTrack = false) {
        console.log('play------2343')
        if (useNewTrack || !this.currentTrack) {
            console.log("Playing new track");
            this.getNextTrack();
            this.loadTrackStream();
            this.start();
        } else {
            this.resume();
        }
    }

    // Get the stream from the filepath
    loadTrackStream() {
        const track = this.currentTrack;
        if (!track) return;

        console.log("Starting audio stream");
        this.stream = createReadStream(track.filepath);
    }

    // Start broadcasting audio stream
    async start() {
        const track = this.currentTrack;
        if (!track) return;

        this.playing = true;
        this.throttle = new Throttle(track.bitrate / 8);

        this.stream
            .pipe(this.throttle)
            .on("data", (chunk) => this.broadcast(chunk))
            .on("end", () => this.play(true))
            .on("error", () => this.play(true));
    }
}

const queue = new Queue();
export default queue;
